// src/modules/setting/setting.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from '../../entities/setting.entity';

@Injectable()
export class SettingService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<Setting>) {}

  // Lấy cấu hình hiện tại (Chỉ có 1 cấu hình trong db)
  async findOne(): Promise<Setting> {
    const setting = await this.settingModel.findOne().exec();
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }
    return setting;
  }

  // Cập nhật cấu hình (Chỉ có thể có 1 cấu hình trong db)
  async update(settingData: Partial<Setting>): Promise<Setting> {
    // Đảm bảo chỉ có một cấu hình duy nhất trong DB
    const count = await this.settingModel.countDocuments().exec();
    if (count > 1) {
      throw new BadRequestException('There should be only one setting in the database');
    }

    // Tìm cấu hình duy nhất và cập nhật
    const setting = await this.settingModel.findOneAndUpdate({}, settingData, { new: true }).exec();
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    return setting;
  }
}
