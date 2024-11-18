// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../../entities/user.entity';  // Import User và UserSchema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  // Liên kết schema với MongoDB
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
