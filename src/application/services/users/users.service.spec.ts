import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import UsersRepository from '../../../infrastructure/database/repositories/users.repository';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { generateHash } from '../../utils/handleBcrypt';
import { Order } from '../../utils/constants';
import { UpdateResult } from 'typeorm';

jest.mock('../../utils/handleBcrypt');

const mockUser = {
  id: 1,
  fullname: 'User',
  email: 'user@example.com',
  password: 'anypassword123',
  created: new Date(),
  updated: new Date()
};

const mockUpdateResult: UpdateResult = {
  affected: 1,
  raw: {},
  generatedMaps: []
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  describe('findAll', () => {
    it('should return a PageDto of ListUserDto', async () => {
      const pageOptionsDto: PageOptionsDto = {
        skip: 0,
        take: 10,
        order: Order.ASC
      };
      const mockQueryBuilder: any = {
        getCount: jest.fn().mockResolvedValue(1),
        getRawAndEntities: jest.fn().mockResolvedValue({
          entities: [
            { id: 1, fullname: 'Test User', email: 'test@example.com' }
          ]
        })
      };
      repository.findAll.mockResolvedValue(mockQueryBuilder);

      const result = await service.findAll(pageOptionsDto);

      expect(result.data).toHaveLength(1);
      expect(result.meta.itemCount).toBe(1);
      expect(repository.findAll).toHaveBeenCalledWith(pageOptionsDto);
    });
  });

  describe('findOne', () => {
    it('should return a user when it exists', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'New User',
        email: 'new@example.com',
        password: 'password123'
      };
      const hashedPassword = 'hashedPassword123';
      (generateHash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockUser = {
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        created: new Date(),
        updated: new Date()
      };
      repository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result.data).toEqual(mockUser);
      expect(result.message).toBe('Usuario registrado exitosamente');
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword
      });
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto: UpdateUserDto = {
        fullname: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123'
      };
      const hashedPassword = 'newhashedPassword123';
      (generateHash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockUser = {
        id: 1,
        ...updateUserDto,
        password: hashedPassword,
        created: new Date(),
        updated: new Date()
      };
      repository.findOne.mockResolvedValue(mockUser);
      repository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update(1, updateUserDto);

      expect(result.data).toEqual(mockUser);
      expect(result.message).toBe('Usuario actualizado exitosamente');
      expect(repository.update).toHaveBeenCalledWith(1, {
        ...updateUserDto,
        password: hashedPassword
      });
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {} as UpdateUserDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing user', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue(mockUpdateResult);

      const result = await service.remove(1);

      expect(result.data).toEqual(mockUser);
      expect(result.message).toBe('Usuario eliminado exitosamente');
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing non-existent user', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
