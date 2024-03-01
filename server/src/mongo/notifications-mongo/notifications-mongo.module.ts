import { Module } from '@nestjs/common';
import { NotificationsMongoService } from './notifications-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notifications,
  NotificationsSchema,
} from './notifications-mongo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notifications.name,
        schema: NotificationsSchema,
      },
    ]),
  ],
  providers: [NotificationsMongoService],
  exports: [
    MongooseModule.forFeature([
      {
        name: Notifications.name,
        schema: NotificationsSchema,
      },
    ]),
    NotificationsMongoService,
  ],
})
export class NotificationsMongoModule {}
