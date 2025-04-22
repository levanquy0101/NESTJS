// src/entities/user.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from './role.entity';


@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: [true, 'Username không được để trống!'], maxlength: [45, 'Username không được quá 45 ký tự!'] })
  username: string;
  
  @Prop({ required: [true, 'Tên không được để trống!'], maxlength: [45, 'Tên không được quá 45 ký tự!'] })
  name: string;  

  @Prop({ unique: true, required: [true, 'Email là bắt buộc!'], match: [/\S+@\S+\.\S+/, 'Email không hợp lệ!'] })
  email: string;

  @Prop({ maxlength: [45, 'Trường không được vượt quá 45 ký tự!'] })
  dob: string;

  @Prop({ match: [/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số!'] })
  phone: string;

  @Prop({ maxlength: [255, 'Trường không được vượt quá 255 ký tự!'] })
  address: string;

  @Prop({ maxlength: [512, 'Trường không được vượt quá 512 ký tự!'] })
  about: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: Role;

  @Prop({ maxlength: [512, 'Trường không được vượt quá 512 ký tự!'] })
  background: string;

  @Prop({ maxlength: [512, 'Trường không được vượt quá 512 ký tự!'] })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
