import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { HistoryMongoModule } from 'src/mongo/history-mongo/history-mongo.module';

@Module({
  imports: [HistoryMongoModule],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
