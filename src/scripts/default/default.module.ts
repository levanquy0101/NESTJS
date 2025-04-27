import { Module } from '@nestjs/common';
import { DefaultDataService } from './default-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Setting } from '../../entities/setting.entity';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Setting]),
    RoleModule,
  ],
  providers: [DefaultDataService],
  exports: [DefaultDataService],
})
export class DefaultDataModule {}
