import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query } from './query-mongo.schema';

@Injectable()
export class QueryMongoService {
  constructor(
    @InjectModel('Query') private readonly queryModel: Model<Query>,
  ) {}

  async create(query: Query) {
    try {
      const createdQuery = new this.queryModel(query);
      return await createdQuery.save();
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
    const queryDoc = await this.queryModel.findByIdAndUpdate(query, update, {
      new: true,
      ...options,
    });
    if (!!!queryDoc) {
      throw new NotFoundException('Query not found');
    }
    return queryDoc;
  }

  async findOne({
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
    const queryDoc = await this.queryModel
      .findOne(query, projection, options)
      .populate(populate);

    if (!!!queryDoc) {
      throw new NotFoundException('Query not found');
    }
    return queryDoc;
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
    const queryDoc = await this.queryModel
      .find(query, projection, options)
      .sort({ createdAt: -1 })
      .populate(populate);

    return queryDoc;
  }

  async remove({ query }: { query: any }) {
    const queryDoc = await this.queryModel.findOneAndDelete(query);
    if (!!!queryDoc) {
      throw new NotFoundException('Query not found');
    }
    return { message: 'Query deleted' };
  }
}
