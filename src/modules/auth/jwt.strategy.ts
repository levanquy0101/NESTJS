import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';  // Thư viện passport
import { ExtractJwt, Strategy } from 'passport-jwt';  // Thư viện passport-jwt
import { UserService } from '../user/user.service';  // Dịch vụ User
import { User } from '../../entities/user.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies['access_token']; // Lấy JWT từ cookie
        return token ? token : null;
      },
      ignoreExpiration: false,  // Không bỏ qua hạn sử dụng của token
      secretOrKey: 'your-secret-key',  // Dùng khóa bí mật để xác thực token
    });
  }

  async validate(payload: any): Promise<User> {
    // Kiểm tra người dùng với payload từ token
    const user = await this.userService.findByUsername(payload.username);
    return user;  // Nếu người dùng hợp lệ, trả về user
  }
}
