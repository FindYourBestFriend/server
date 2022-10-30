import { Test, TestingModule } from '@nestjs/testing';
import { OngController } from './ong.controller';
import { OngService } from './ong.service';
import { ongMock } from '@mocks/ong.mock';

const ongList = ongMock.listOfOngs;

const req = {
  headers: {
    user: {
      id: '12314',
    },
  },
};

describe('OngController', () => {
  let ongController: OngController;
  let ongService: OngService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OngController],
      providers: [
        {
          provide: OngService,
          useValue: {
            find: jest.fn().mockResolvedValue(ongList),
            findAllOfCurrentUser: jest.fn().mockResolvedValue(ongList),
            findOne: jest.fn().mockResolvedValue(ongList[0]),
            findOneOrFail: jest.fn().mockResolvedValue(ongList[0]),
            save: jest.fn().mockResolvedValue(ongList[0]),
            update: jest.fn().mockResolvedValue(ongList[0]),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    ongController = module.get<OngController>(OngController);
    ongService = module.get<OngService>(OngService);
  });

  it('should be defined', () => {
    expect(ongController).toBeDefined();
    expect(ongService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all ongs of current user successfully', async () => {
      const result = await ongController.findAll(req);

      expect(result).toBe(ongList);
      expect(ongService.findAllOfCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should save a new ong successfully', async () => {
      const body = ongMock.ong;
      const result = await ongController.save(body);
      expect(result).toBe(ongList[0]);
      expect(ongService.save).toBeCalledTimes(1);
      expect(ongService.save).toBeCalledWith(body);
    });
  });

  describe('update', () => {
    it('should update a ong successfully', async () => {
      const body = ongMock.ong;
      const result = await ongController.update('1', body);
      expect(result).toBe(ongList[0]);
      expect(ongService.update).toBeCalledTimes(1);
      expect(ongService.update).toBeCalledWith('1', body);
    });
  });

  describe('delete', () => {
    it('should delete an ong successfully', async () => {
      const result = await ongController.delete('1');

      expect(result).toBeUndefined();
      expect(ongService.deleteById).toHaveBeenCalledTimes(1);
      expect(ongService.deleteById).toBeCalledWith('1');
    });
  });
});
