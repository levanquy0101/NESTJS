// src/modules/user/user.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request, Put, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';  // Import User entity
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);  // Tạo người dùng và lưu vào MongoDB
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();  // Lấy tất cả người dùng từ MongoDB
  }

  // Route này yêu cầu người dùng phải đăng nhập (có JWT hợp lệ)
  @Get('me')
  @UseGuards(JwtAuthGuard)  // Áp dụng bảo vệ cho route này
  getProfile(@Request() req) {
    return req.user;  // Trả về thông tin người dùng từ request (đã được lưu ở validate trong JwtStrategy)
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 }
    ])
  )
  async update(
    @Request() req, 
    @Body() user: User, 
    @UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] }
  ): Promise<User> {
    const userId = req.user._id;
  
    if (files.avatar?.length > 0) {
      const uploadResult = await this.cloudinaryService.uploadImage(files.avatar[0]);
      user.avatar = uploadResult.secure_url;
    }
  
    if (files.background?.length > 0) {
      const uploadResult = await this.cloudinaryService.uploadImage(files.background[0]);
      user.background = uploadResult.secure_url;
    }
  
    return this.userService.update(userId, user);
  }
}
