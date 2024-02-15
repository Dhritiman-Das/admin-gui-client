import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project-mongo.schema';

@Injectable()
export class ProjectMongoService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async create(project: Project) {
    const createdProject = new this.projectModel(project);
    return await createdProject.save();
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
    return await this.projectModel.findOne(query, projection, options).exec();
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
    return await this.projectModel
      .findOneAndUpdate(query, update, options)
      .exec();
  }
}
