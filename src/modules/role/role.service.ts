// src/roles/roles.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>, // Inject Role model
  ) {}

  // Tạo mới role
  async create(role: Partial<Role>): Promise<Role> {
    const createdRole = new this.roleModel(role);
    return createdRole.save();
  }

  // Lấy tất cả role
  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  // Tìm kiếm role theo ID
  async findById(id: string): Promise<Role> {
    return this.roleModel.findById(id).exec();
  }

  // Tìm kiếm role theo name
  async findByName(name: string): Promise<Role> {
    return this.roleModel.findOne({ name }).exec();
  }
}
