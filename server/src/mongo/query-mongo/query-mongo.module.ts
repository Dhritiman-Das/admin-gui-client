import { Module } from '@nestjs/common';
import { QueryMongoService } from './query-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Query, QuerySchema } from './query-mongo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Query.name,
        schema: QuerySchema,
      },
    ]),
  ],
  providers: [QueryMongoService],
  exports: [
    QueryMongoService,
    MongooseModule.forFeature([
      {
        name: Query.name,
        schema: QuerySchema,
      },
    ]),
    QueryMongoService,
  ],
})
export class QueryMongoModule {}
