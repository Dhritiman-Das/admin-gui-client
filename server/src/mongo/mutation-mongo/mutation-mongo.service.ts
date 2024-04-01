import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Mutation } from './mutation-mongo.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MutationMongoService {
  constructor(
    @InjectModel('Mutation') private readonly mutationModel: Model<Mutation>,
  ) {}

  async create(mutation: Mutation) {
    try {
      const createdMutation = new this.mutationModel(mutation);
      return await createdMutation.save();
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    const mutationDoc = await this.mutationModel.findByIdAndUpdate(
      query,
      update,
      {
        new: true,
        ...options,
      },
    );
    if (!!!mutationDoc) {
      throw new NotFoundException('Mutation not found');
    }
    return mutationDoc;
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
    const mutationDoc = await this.mutationModel
      .findOne(query, projection)
      .populate(populate);
    return mutationDoc;
  }

  async find({
    query,
    projection,
    options,
    populate,
  }: {
    query: any;
    projection?: any;
    options?: any;
    populate?: any;
  }) {
    const mutationDoc = await this.mutationModel
      .find(query, projection, options)
      .populate(populate);
    return mutationDoc;
  }

  async delete({ query }: { query: any }) {
    const mutationDoc = await this.mutationModel.findByIdAndDelete(query);
    if (!!!mutationDoc) {
      throw new NotFoundException('Mutation not found');
    }
    return mutationDoc;
  }
}
