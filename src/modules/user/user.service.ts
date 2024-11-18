// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../entities/user.entity';  // Import User entity

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,  // Tiêm model User
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();  // Lưu người dùng vào MongoDB
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();  // Lấy tất cả người dùng từ MongoDB
  }
}
