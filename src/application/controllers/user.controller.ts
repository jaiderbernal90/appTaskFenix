import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { ApiPaginatedResponse } from '../utils/constants';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto } from '../dto/page.dto';
import { IUserService } from '../interfaces/services/IUserService.interface';
import { ListUserDto } from '../dto/user/list-user.dto';
import { IResponse } from '../interfaces/IResponse.interface';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {

    constructor(@Inject('USER_SERVICE_TOKEN') private readonly service: IUserService) { }

    @Get()
    @HttpCode(200)
    @ApiPaginatedResponse(ListUserDto)
    async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<ListUserDto>> {
        return this.service.findAll(pageOptionsDto);
    }

    @HttpCode(200)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.service.findOne(id);
    }

    @HttpCode(201)
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateUserDto): Promise<IResponse<ListUserDto>> {
        return await this.service.create(dto);
    }

    @HttpCode(201)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return await this.service.update(id, dto);
    }

    @HttpCode(200)
    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.service.remove(id);
    }
}
