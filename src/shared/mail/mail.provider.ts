import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export const MailProvider = {
  provide: 'MAIL_TRANSPORTER',
  useFactory: async (configService: ConfigService) => {
    const host = configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = configService.get<number>('SMTP_PORT', 587);
    const user = configService.get<string>('SMTP_USER');
    const pass = configService.get<string>('SMTP_PASS');

    if (!user || !pass) {
      throw new Error('SMTP_USER and SMTP_PASS are required');
    }

    const transporter = nodemailer.createTransporter({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });

    await transporter.verify();
    console.log('✅ Mail server connected');
    return transporter;
  },
  inject: [ConfigService],
}; 