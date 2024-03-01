import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { Notifications } from './notifications-mongo.schema';

@Injectable()
export class NotificationsMongoService {
  constructor(
    @InjectModel('Notifications')
    private readonly notificationsModel: Model<Notifications>,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    const createdNotification = new this.notificationsModel(
      createNotificationDto,
    );
    return createdNotification.save();
  }

  findAllByUser(userId: string) {
    return this.notificationsModel.find({ user: userId });
  }
}
