import { Test, TestingModule } from '@nestjs/testing';
import { HistoryMongoService } from './history-mongo.service';

describe('HistoryMongoService', () => {
  let service: HistoryMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryMongoService],
    }).compile();

    service = module.get<HistoryMongoService>(HistoryMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
