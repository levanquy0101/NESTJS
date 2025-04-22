import { Controller, Post, Body, Res, UseGuards, Request, Put, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    return this.authService.login(body.username, body.password, res);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'Đã đăng xuất thành công' });
  }

  // Yêu cầu quên mật khẩu
  @Post('forgot-password')
  async forgotPassword(@Body() body: { username: string }, @Res() res: Response) {
    try {
      await this.authService.requestPasswordReset(body.username);
      return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Thay đổi mật khẩu
  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
    @Res() res: Response,
  ) {
    try {
      await this.authService.resetPassword(body.token, body.newPassword);
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard) // Chỉ cho phép người dùng đã đăng nhập
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string; confirmPassword: string },
    @Res() res: Response,
  ) {
    try {
      await this.authService.changePassword(req.user._id, body.oldPassword, body.newPassword, body.confirmPassword);
      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.status(400).json({ message: error });
      }
      return res.status(400).json({ message: error });
    }
  }
}
