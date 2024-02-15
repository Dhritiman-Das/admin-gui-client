import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { HistoryMongoService } from 'src/mongo/history-mongo/history-mongo.service';

@Injectable()
export class HistoryService {
  constructor(private readonly historyMongoService: HistoryMongoService) {}
  async create(createHistoryDto: CreateHistoryDto) {
    return await this.historyMongoService.create(createHistoryDto);
  }

  findAll() {
    return `This action returns all history`;
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
    return await this.historyMongoService.find({
      query,
      projection,
      options,
      populate,
    });
  }

  findOne({
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
    return this.historyMongoService.findOne({
      query,
      projection,
      options,
      populate,
    });
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
