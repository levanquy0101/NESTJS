// src/modules/default/default-data.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';  // Import bcryptjs
import { User } from '../../entities/user.entity';
import { RoleService } from '../role/role.service';
import { DEFAULT_ADMIN_USER, DEFAULT_ROLES } from 'src/shared/constants';

@Injectable()
export class DefaultDataService implements OnModuleInit {
  constructor(
    private readonly roleService: RoleService,  // Tiêm RoleService
    @InjectModel(User.name) private readonly userModel: Model<User>, // Tiêm UserModel
  ) {}

  async onModuleInit() {
    await this.createDefaultRoles();
    await this.createAdminUser();
  }

  private async createDefaultRoles() {
    for (const roleData of DEFAULT_ROLES) {
      const existingRole = await this.roleService.findByName(roleData.name);
      if (!existingRole) {
        await this.roleService.create(roleData);
        console.log(`Role ${roleData.name} created.`);
      }
    }
  }

  private async createAdminUser() {
    const existingUser = await this.userModel.findOne({ username: DEFAULT_ADMIN_USER.username });
    if (!existingUser) {
      const adminRole = await this.roleService.findByName('ROLE_ADMIN');
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_USER.password, 10);  // Mã hóa mật khẩu

      const adminUser = new this.userModel({
        ...DEFAULT_ADMIN_USER,
        password: hashedPassword,  // Lưu mật khẩu đã mã hóa
        role: adminRole._id,  // Gán role admin cho user
      });

      await adminUser.save();
      console.log('Admin user created with username: admin');
    }
  }
}
