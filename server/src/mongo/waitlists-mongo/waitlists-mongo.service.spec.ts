import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistsMongoService } from './waitlists-mongo.service';

describe('WaitlistsMongoService', () => {
  let service: WaitlistsMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitlistsMongoService],
    }).compile();

    service = module.get<WaitlistsMongoService>(WaitlistsMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
