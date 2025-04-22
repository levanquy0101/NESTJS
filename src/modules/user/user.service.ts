// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../entities/user.entity';  // Import User entity
import * as bcrypt from 'bcryptjs';
import { Role } from '../../entities/role.entity';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly roleService: RoleService, // Tiêm RoleService
  ) {}

  // Tạo người dùng mới
  async create(user: User): Promise<User> {
    const salt = await bcrypt.genSalt(10); // Tạo salt
    user.password = await bcrypt.hash(user.password, salt); // Băm mật khẩu
    const createdUser = new this.userModel(user);
    return createdUser.save(); // Lưu người dùng
  }

  // Lấy tất cả người dùng
  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('role').sort({ createdAt: -1 }).exec();
  }  

  // Lấy người dùng theo ID
  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).populate('role').exec(); // Sử dụng populate
  }

  // Tìm người dùng theo username
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).populate('role').exec(); // Tìm theo username
  }

  // Cập nhật thông tin người dùng
  async update(userId: string, user: User): Promise<User> {
    const existingUser = await this.userModel.findById(userId);  // Lấy người dùng hiện tại
    if (user.password) {
      // Băm mật khẩu mới
      const salt = await bcrypt.genSalt(10); // Tạo salt
      user.password = await bcrypt.hash(user.password, salt); // Băm mật khẩu mới
    } else {
      // Nếu không có mật khẩu mới, giữ mật khẩu cũ
      user.password = existingUser.password;
    }
    user.role = existingUser.role;

    // Cập nhật thông tin người dùng
    return this.userModel.findByIdAndUpdate(userId, user, { new: true, runValidators: true }).exec();
  }

  // Phương thức lấy người dùng theo role
  async findByRole(roleName: string): Promise<User[]> {
    const role = await this.roleService.findByName(roleName); // Lấy role qua roleService
    if (!role) {
      throw new Error(`Role with name "${roleName}" not found`);
    }

    return this.userModel.find({ role: role._id }).populate('role').exec();
  }

}
