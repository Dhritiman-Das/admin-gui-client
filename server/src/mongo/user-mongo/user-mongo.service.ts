import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user-mongo.schema';
import { Model } from 'mongoose';
import { Project } from '../project-mongo/project-mongo.schema';

@Injectable()
export class UserMongoService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(user: User) {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      console.log({ error });

      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOneAndUpdate({
    query,
    update,
    options,
  }: {
    query: any;
    update?: any;
    options?: any;
  }) {
    return await this.userModel
      .findOneAndUpdate(query, update, { ...options, lean: true })
      .populate({
        path: 'projects',
        select: 'name mode',
      });
  }

  async findOne({
    query,
    projection,
    options,
  }: {
    query: any;
    projection?: any;
    options?: any;
  }) {
    const user = await this.userModel
      .findOne(query, projection, { ...options, lean: true })
      .populate({
        path: 'projects',
        select: 'name mode dbConnectionString',
      })
      .exec();
    if (
      user.projects.some(
        (project: Project) =>
          project.mode === 'personal' && !!!project.dbConnectionString,
      )
    ) {
      return { ...user, personalProjectSetup: false };
    }
    return { ...user, personalProjectSetup: true };
  }
}
