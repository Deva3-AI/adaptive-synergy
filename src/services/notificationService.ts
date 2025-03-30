import axios from 'axios';
import apiClient from '@/utils/apiUtils';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const notificationService = {
  // Get all notifications for the current user
  getNotifications: async (userId: number | undefined) => {
    if (!userId) return [];
    
    return apiClient<Notification[]>(
      `/notifications?userId=${userId}`,
      'get',
      undefined,
      [] // Mock data in case API fails
    );
  },
  
  // Get unread notification count
  getUnreadCount: async (userId: number | undefined) => {
    if (!userId) return 0;
    
    const notifications = await notificationService.getNotifications(userId);
    return notifications.filter(n => !n.isRead).length;
  },
  
  // Mark a notification as read
  markAsRead: async (notificationId: number) => {
    return apiClient<Notification>(
      `/notifications/${notificationId}/read`,
      'put'
    );
  },
  
  // Mark all notifications as read
  markAllAsRead: async (userId: number | undefined) => {
    if (!userId) return;
    
    return apiClient<{ success: boolean }>(
      `/notifications/mark-all-read`,
      'put',
      { userId }
    );
  },
  
  // Delete a notification
  deleteNotification: async (notificationId: number) => {
    return apiClient<{ success: boolean }>(
      `/notifications/${notificationId}`,
      'delete'
    );
  },
  
  // Create a new notification
  createNotification: async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    return apiClient<Notification>(
      '/notifications',
      'post',
      {
        ...notification,
        isRead: false
      }
    );
  },
  
  // Display a toast notification
  showNotification: (notification: Pick<Notification, 'title' | 'message' | 'type'>) => {
    switch (notification.type) {
      case 'success':
        toast.success(notification.title, {
          description: notification.message,
        });
        break;
      case 'error':
        toast.error(notification.title, {
          description: notification.message,
        });
        break;
      case 'warning':
        toast.warning(notification.title, {
          description: notification.message,
        });
        break;
      case 'info':
      default:
        toast.info(notification.title, {
          description: notification.message,
        });
        break;
    }
  }
};

export default notificationService;
