import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsMongoService } from 'src/mongo/notifications-mongo/notifications-mongo.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsMongoService: NotificationsMongoService,
  ) {}
  create(createNotificationDto: CreateNotificationDto) {
    return this.notificationsMongoService.create(createNotificationDto);
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findAllByUser(userId: string) {
    return this.notificationsMongoService.findAllByUser(userId);
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
