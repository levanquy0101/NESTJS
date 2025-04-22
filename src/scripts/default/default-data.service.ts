import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';  // Import bcryptjs
import { User } from '../../entities/user.entity';
import { Setting } from '../../entities/setting.entity';
import { RoleService } from 'src/modules/role/role.service';
import { DEFAULT_ADMIN_USER, DEFAULT_ROLES, DEFAULT_SETTING } from 'src/shared/constants';

@Injectable()
export class DefaultDataService implements OnModuleInit {
  constructor(
    private readonly roleService: RoleService,  // Inject RoleService
    @InjectModel(User.name) private readonly userModel: Model<User>, // Inject UserModel
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>,  // Inject SettingModel
  ) {}

  async onModuleInit() {
    await this.createDefaultRoles();
    await this.createAdminUser();
    await this.createDefaultSetting();
  }

  // Tạo các vai trò mặc định
  private async createDefaultRoles() {
    for (const roleData of DEFAULT_ROLES) {
      const existingRole = await this.roleService.findByName(roleData.name);
      if (!existingRole) {
        await this.roleService.create(roleData);
        console.log(`Role ${roleData.name} created.`);
      }
    }
  }

  // Tạo người dùng admin mặc định
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

  // Tạo cấu hình mặc định cho ứng dụng
  private async createDefaultSetting() {
    const existingSetting = await this.settingModel.findOne().exec();  // Kiểm tra có setting nào chưa
    if (!existingSetting) {
      const defaultSetting = new this.settingModel(DEFAULT_SETTING);  // Tạo cấu hình mặc định
      await defaultSetting.save();
      console.log('Default setting created.');
    } else {
      console.log('Default setting already exists.');
    }
  }
}
