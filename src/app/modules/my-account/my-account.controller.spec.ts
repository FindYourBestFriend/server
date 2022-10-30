import { User } from '@app/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MyAccountController } from './my-account.controller';
import { MyAccountService } from './my-account.service';

const user = new User({ name: 'Gabriel', email: 'gabriel@findyourbestfriend.social' })

describe('MyAccountController', () => {
  let controller: MyAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyAccountController],
      providers: [
        {
          provide: MyAccountService,
          useValue: {
            currentUser: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(user)
          },
        },
      ],
    }).compile();

    controller = module.get<MyAccountController>(MyAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
