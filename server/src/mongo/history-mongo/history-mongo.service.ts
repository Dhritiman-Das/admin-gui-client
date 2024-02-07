import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History } from './history-mongo.schema';

@Injectable()
export class HistoryMongoService {
  constructor(
    @InjectModel('History') private readonly historyModel: Model<History>,
  ) {}

  async create(history: History) {
    try {
      const createdHistory = new this.historyModel(history);
      return await createdHistory.save();
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
