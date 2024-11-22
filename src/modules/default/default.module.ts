// src/modules/default-data/default-data.module.ts
import { Module } from '@nestjs/common';
import { DefaultDataService } from './default-data.service';
import { RoleModule } from '../role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  // Đảm bảo UserModel được đăng ký
    RoleModule,
  ],
  providers: [DefaultDataService],
  exports: [DefaultDataService],  // Nếu cần, bạn có thể export DefaultDataService cho các module khác
})
export class DefaultDataModule {}
