import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import UsersRepository from '../../../infrastructure/database/repositories/users.repository';
import { LoginDto } from '../../dto/auth/login.dto';
import { RegisterDto } from '../../dto/auth/register.dto';
import { NotFoundException, HttpException } from '@nestjs/common';
import * as bcryptUtils from '../../utils/handleBcrypt';
import { AuthService } from './auth.service';

jest.mock('../../utils/handleBcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };

    const mockJwtService = {
      sign: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('should return a token when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      const mockUser = {
        id: 1,
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created: new Date(),
        updated: new Date()
      };
      const mockToken = 'mockJwtToken';

      usersRepository.findByEmail.mockResolvedValue(mockUser);
      (bcryptUtils.compareHash as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({ token: mockToken });
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcryptUtils.compareHash).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        fullname: mockUser.fullname
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException when password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      const mockUser = {
        id: 1,
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created: new Date(),
        updated: new Date()
      };

      usersRepository.findByEmail.mockResolvedValue(mockUser);
      (bcryptUtils.compareHash as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(HttpException);
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        fullname: 'New User',
        email: 'new@example.com',
        password: 'password123'
      };
      const hashedPassword = 'hashedPassword123';
      const mockCreatedUser = {
        id: 1,
        fullname: 'New User',
        email: 'new@example.com',
        created: new Date(),
        updated: new Date()
      };

      (bcryptUtils.generateHash as jest.Mock).mockResolvedValue(hashedPassword);
      usersRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        message: 'Usuario registrado exitosamente',
        data: mockCreatedUser
      });
      expect(bcryptUtils.generateHash).toHaveBeenCalledWith(
        registerDto.password
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword
      });
    });
  });
});
