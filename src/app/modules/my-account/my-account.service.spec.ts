import { Test, TestingModule } from '@nestjs/testing';
import { MyAccountService } from './my-account.service';

describe('MyAccountService', () => {
  let service: MyAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyAccountService],
    }).compile();

    service = module.get<MyAccountService>(MyAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
