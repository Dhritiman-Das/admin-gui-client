import { Module } from '@nestjs/common';
import { MutationMongoService } from './mutation-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mutation } from 'src/mutation/entities/mutation.entity';
import { MutationSchema } from './mutation-mongo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Mutation.name,
        schema: MutationSchema,
      },
    ]),
  ],
  providers: [MutationMongoService],
  exports: [
    MutationMongoService,
    MongooseModule.forFeature([
      {
        name: Mutation.name,
        schema: MutationSchema,
      },
    ]),
    MutationMongoService,
  ],
})
export class MutationMongoModule {}
