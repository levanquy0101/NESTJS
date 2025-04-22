import { Module } from '@nestjs/common';
import { DefaultDataService } from './default-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../entities/user.entity';
import { Setting, SettingSchema } from '../../entities/setting.entity';
import { RoleModule } from 'src/modules/role/role.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },  
      { name: Setting.name, schema: SettingSchema }, 
    ]),
    RoleModule, 
  ],
  providers: [DefaultDataService],
  exports: [DefaultDataService], 
})
export class DefaultDataModule {}
