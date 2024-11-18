// src/modules/user/user.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';  // Import User entity

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);  // Tạo người dùng và lưu vào MongoDB
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();  // Lấy tất cả người dùng từ MongoDB
  }
}
