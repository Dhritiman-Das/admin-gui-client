import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsMongoService } from './notifications-mongo.service';

describe('NotificationsMongoService', () => {
  let service: NotificationsMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsMongoService],
    }).compile();

    service = module.get<NotificationsMongoService>(NotificationsMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
