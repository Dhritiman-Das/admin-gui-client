import { Test, TestingModule } from '@nestjs/testing';
import { QueryMongoService } from './query-mongo.service';

describe('QueryMongoService', () => {
  let service: QueryMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryMongoService],
    }).compile();

    service = module.get<QueryMongoService>(QueryMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
