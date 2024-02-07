import { Module } from '@nestjs/common';
import { HistoryMongoService } from './history-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from './history-mongo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: History.name,
        schema: HistorySchema,
      },
    ]),
  ],
  providers: [HistoryMongoService],
  exports: [
    MongooseModule.forFeature([
      {
        name: History.name,
        schema: HistorySchema,
      },
    ]),
    HistoryMongoService,
  ],
})
export class HistoryMongoModule {}
