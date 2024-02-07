import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findOne({
    query,
    projection,
    options,
  }: {
    query: any;
    projection?: any;
    options?: any;
  }) {
    return await this.queryModel.findOne(query, projection, options).exec();
  }
}
