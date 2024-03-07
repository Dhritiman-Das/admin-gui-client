import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project-mongo.schema';

@Injectable()
export class ProjectMongoService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async create(project: Project): Promise<ProjectDocument> {
    console.log({ projectPayload: project });

    const createdProject = new this.projectModel(project);
    return await createdProject.save();
  }

  async findOne({
    query,
    projection,
    populate,
  }: {
    query: any;
    projection?: any;
    populate?: any;
  }): Promise<ProjectDocument> {
    return await this.projectModel
      .findOne(query, projection)
      .populate(populate)
      .exec();
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
