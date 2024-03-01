import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { ProjectsService } from 'src/projects/projects.service';
import { WaitlistsMongoService } from 'src/mongo/waitlists-mongo/waitlists-mongo.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userMongoService: UserMongoService,
    private readonly projectService: ProjectsService,
    private readonly waitlistsMongoService: WaitlistsMongoService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userMongoService.create(createUserDto);

    const project = await this.projectService.create({
      name: createUserDto.name,
      description: '',
      dbConnectionString: '',
      admin: user,
      mode: 'personal',
      deleted: false,
    });
    const waitlistedProjectsObj = await this.waitlistsMongoService.findOne({
      email: createUserDto.email,
    });

    let waitlistedProject = [];
    if (waitlistedProjectsObj) {
      waitlistedProject = waitlistedProjectsObj.project;
    }
    const userUpdated = await this.userMongoService.findOneAndUpdate({
      query: { _id: user._id },
      update: {
        $push: {
          projects: {
            project,
            role: 'admin',
            isAdvancedSettings: false,
            advancedSettings: {
              query: 'admin',
              mutate: 'admin',
              members: 'admin',
              projects: 'admin',
            },
          },
          invitedProjects: waitlistedProject,
        },
      },
      options: { new: true },
    });

    if (userUpdated && !!waitlistedProjectsObj) {
      await this.waitlistsMongoService.findOneAndDelete({
        query: { email: createUserDto.email },
      });
    }
    const projectId = project._id.toString();
    return userUpdated;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne({
    query,
    projection,
    populate,
  }: {
    query: any;
    projection?: any;
    populate?: any;
  }) {
    return await this.userMongoService.findOne({
      query,
      projection,
      populate,
    });
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userMongoService.findOneAndUpdate({
      query: { _id: userId },
      update: updateUserDto,
      options: { new: true },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkIfUserExist(email: string) {
    return await this.userMongoService.findOne({
      query: { email },
    });
  }
}
