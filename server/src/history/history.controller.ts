import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  @Get('/projects/:projectId')
  getHistory(@Param('projectId') projectId: string) {
    return this.historyService.find({
      query: { project: projectId },
      options: { sort: { createdAt: -1 } },
      populate: [
        { path: 'user', select: '_id name image' },
        { path: 'query', select: '_id name dbName dbCollectionName' },
        { path: 'mutation', select: '_id name dbName dbCollectionName' },
      ],
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne({
      query: { _id: id },
      populate: [
        { path: 'user', select: '_id name image' },
        { path: 'query', select: '_id name dbName dbCollectionName' },
        { path: 'mutation', select: '_id name dbName dbCollectionName' },
      ],
    });
  }

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.historyService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.historyService.update(+id, updateHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(+id);
  }
}
