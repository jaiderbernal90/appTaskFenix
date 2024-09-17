import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { IUserService } from '@interfaces/services/IUserService.interface';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { CreateUserDto } from '../../../application/dto/user/create-user.dto';
import { UpdateUserDto } from '../../../application/dto/user/update-user.dto';
import { ListUserDto } from '../../../application/dto/user/list-user.dto';
import { PageDto } from '../../dto/page.dto';
import { IResponse } from '@interfaces/IResponse.interface';
import { JwtAuthGuard } from '../../utils/guards/jwt-auth.guard';
import { Order } from '../../utils/constants';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<IUserService>;

  beforeEach(async () => {
    const mockUserService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'USERS_SERVICE_TOKEN',
          useValue: mockUserService
        }
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get('USERS_SERVICE_TOKEN');
  });

  describe('findAll', () => {
    it('should return a PageDto of ListUserDto', async () => {
      const pageOptionsDto: PageOptionsDto = {
        skip: 0,
        take: 10,
        order: Order.ASC
      };
      const expectedResult: PageDto<ListUserDto> = {
        data: [
          {
            id: 1,
            fullname: 'Test User',
            email: 'test@example.com',
            created: new Date(),
            updated: new Date()
          }
        ],
        meta: {
          itemCount: 1,
          pageCount: 1,
          page: 1,
          take: 10,
          hasPreviousPage: false,
          hasNextPage: false
        }
      };

      service.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll(pageOptionsDto)).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(pageOptionsDto);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const expectedResult: ListUserDto = {
        id: 1,
        fullname: 'Test User',
        email: 'test@example.com',
        created: new Date(),
        updated: new Date()
      };

      service.findOne.mockResolvedValue(expectedResult);

      expect(await controller.findOne(1)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'New User',
        email: 'new@example.com',
        password: 'somepassword123'
      };
      const expectedResult: IResponse<ListUserDto> = {
        message: 'Usuario registrado exitosamente',
        data: {
          id: 1,
          fullname: 'New User',
          email: 'new@example.com',
          created: new Date(),
          updated: new Date()
        }
      };

      service.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createUserDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto: UpdateUserDto = {
        fullname: 'Updated User',
        email: 'updated@example.com'
      };
      const expectedResult: IResponse<ListUserDto> = {
        message: 'Usuario actualizado exitosamente',
        data: {
          id: 1,
          fullname: 'Updated User',
          email: 'updated@example.com',
          created: new Date(),
          updated: new Date()
        }
      };

      service.update.mockResolvedValue(expectedResult);

      expect(await controller.update(1, updateUserDto)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove an existing user', async () => {
      const expectedResult: IResponse<ListUserDto> = {
        message: 'Usuario eliminado exitosamente',
        data: {
          id: 1,
          fullname: 'Removed User',
          email: 'removed@example.com',
          created: new Date(),
          updated: new Date()
        }
      };

      service.remove.mockResolvedValue(expectedResult);

      expect(await controller.remove(1)).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
