import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Waitlists, WaitlistsDocument } from './waitlists-mongo.schema';
import { Model, ObjectId, Types } from 'mongoose';
import {
  AddMembersDto,
  ProjectPermissionsDto,
} from 'src/projects/dto/add-members.dto';

@Injectable()
export class WaitlistsMongoService {
  constructor(
    @InjectModel(Waitlists.name)
    private readonly waitlistsModel: Model<Waitlists>,
  ) {}

  async create(waitlist: {
    email: string;
    projectPermissions: ProjectPermissionsDto;
  }) {
    const waitlistObj = await this.findOne({ email: waitlist.email });
    if (!waitlistObj) {
      //no waitlist yet for the user, create one
      const createdWaitlist = new this.waitlistsModel({
        email: waitlist.email,
        project: [waitlist.projectPermissions],
      });

      return createdWaitlist.save();
    }
    //Check if the project is already in the waitlist
    if (
      waitlistObj.project.find(
        (projectPermissions) =>
          projectPermissions.project._id.toString() ===
          waitlist.projectPermissions.project.toString(),
      )
    ) {
      throw new BadRequestException('Already sent a request for this project.');
    }

    //last condition: this means there is already a waitlist for the user, just push the new project
    return this.findOneAndUpdate({
      query: { email: waitlist.email },
      update: { $push: { project: waitlist.projectPermissions } },
    });
  }

  async findOne({ email }: { email: string }): Promise<WaitlistsDocument> {
    return await this.waitlistsModel
      .findOne({
        email: email,
      })
      .exec();
  }

  async findAll({
    query,
    projection,
  }: {
    query: any;
    projection?: any;
  }): Promise<WaitlistsDocument[]> {
    return await this.waitlistsModel.find(query, projection).exec();
  }

  async findAllUnregisteredUsers(projectId: string) {
    const waitlistedUsers = await this.waitlistsModel.aggregate([
      { $match: { 'project.project': new Types.ObjectId(projectId) } },
      { $unwind: '$project' },
      { $match: { 'project.project': new Types.ObjectId(projectId) } },
      {
        $group: {
          _id: { email: '$email' },
          name: { $first: 'Unregistered user' },
          projects: { $push: '$project' },
          status: { $first: 'pending' },
        },
      },
      {
        $project: {
          _id: '',
          email: '$_id.email',
          name: 1,
          projects: 1,
          status: 1,
        },
      },
    ]);

    return waitlistedUsers;
  }

  async findOneAndDelete({ query }: { query: any }) {
    return await this.waitlistsModel.findOneAndDelete(query).exec();
  }

  async findOneAndUpdate({
    query,
    update,
    options,
  }: {
    query: any;
    update: any;
    options?: any;
  }) {
    return await this.waitlistsModel.findOneAndUpdate(query, update).exec();
  }
}
