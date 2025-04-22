import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';  // Import User entity nếu cần

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  // Tạo mới một thông báo
  async createNotification(title: string ,content: string, userId: string): Promise<Notification> {
    const newNotification = new this.notificationModel({
      title,
      content,
      user: userId,
    });
    return newNotification.save();
  }

  // Lấy tất cả thông báo của người dùng
  async getNotifications(userId: string, page: number = 1, limit: number = 100): Promise<{ data: Notification[]; total: number; currentPage: number; totalPages: number }> {
    const skip = (page - 1) * limit;  // Tính toán số bản ghi cần bỏ qua (skip)
  
    // Truy vấn dữ liệu và tổng số bản ghi
    const [data, total] = await Promise.all([
      this.notificationModel.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),  // Truy vấn với phân trang
      this.notificationModel.countDocuments({ user: userId }).exec(),  // Đếm tổng số bản ghi của người dùng
    ]);
  
    return {
      data,  // Dữ liệu trả về
      total,  // Tổng số bản ghi
      currentPage: page,  // Trang hiện tại
      totalPages: Math.ceil(total / limit),  // Tổng số trang
    };
  }
  

  // Đánh dấu thông báo là đã đọc
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    ).exec();
  }

  // Lấy số lượng thông báo chưa đọc của người dùng
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      user: userId,
      isRead: false,
    }).exec();
  }
}
