import { Module } from '@nestjs/common';
import { WaitlistsMongoService } from './waitlists-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Waitlists, WaitlistsSchema } from './waitlists-mongo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Waitlists.name,
        schema: WaitlistsSchema,
      },
    ]),
  ],
  providers: [WaitlistsMongoService],
  exports: [
    MongooseModule.forFeature([
      {
        name: Waitlists.name,
        schema: WaitlistsSchema,
      },
    ]),
    WaitlistsMongoService,
  ],
})
export class WaitlistsMongoModule {}
