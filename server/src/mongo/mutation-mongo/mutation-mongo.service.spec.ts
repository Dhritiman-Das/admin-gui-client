import { Test, TestingModule } from '@nestjs/testing';
import { MutationMongoService } from './mutation-mongo.service';

describe('MutationMongoService', () => {
  let service: MutationMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MutationMongoService],
    }).compile();

    service = module.get<MutationMongoService>(MutationMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
