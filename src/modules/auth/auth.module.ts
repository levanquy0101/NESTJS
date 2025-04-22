import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CommonModule,
    JwtModule.register({
      secret: 'your-secret-key', // Key dùng để ký JWT, có thể thay đổi thành một giá trị bảo mật hơn
      signOptions: { expiresIn: '24h' }, // JWT sẽ hết hạn sau 1 giờ
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
