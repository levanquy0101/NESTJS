import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [CloudinaryModule, MailModule],
  exports: [CloudinaryModule, MailModule],
})
export class SharedModule {} 