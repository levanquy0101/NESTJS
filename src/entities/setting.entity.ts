// src/entities/setting.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'setting', timestamps: true }) 
export class Setting extends Document {
  
  @Prop({ required: true, unique: true })  // Đảm bảo appName là duy nhất
  appName: string;
  
  @Prop({ required: true })
  logo: string;
  
  @Prop({ required: true })
  emailNotification: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

// Tạo index duy nhất cho appName
SettingSchema.index({ appName: 1 }, { unique: true });
