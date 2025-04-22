// src/entities/notification.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.entity';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string; // Tiêu đề thông báo

  @Prop({ required: true })
  content: string; // Nội dung thông báo

  @Prop({ type: Boolean, default: false })
  isRead: boolean; // Trạng thái của thông báo (false: chưa đọc, true: đã đọc)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User; // Người nhận thông báo
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
