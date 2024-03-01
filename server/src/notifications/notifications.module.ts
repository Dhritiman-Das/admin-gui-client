import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsMongoModule } from 'src/mongo/notifications-mongo/notifications-mongo.module';

@Module({
  imports: [NotificationsMongoModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
