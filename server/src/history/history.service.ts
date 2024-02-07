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

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
