
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '@/config/config';
import { toast } from 'sonner';

// Create base URL for notifications API
const BASE_URL = `${config.apiUrl}/notifications`;

// Generic API request function with correct typing
const apiRequest = async <T>(url: string, options?: AxiosRequestConfig): Promise<T> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Notification service
const notificationService = {
  // Get all notifications for the current user
  getNotifications: async () => {
    return apiRequest<any[]>(`${BASE_URL}`);
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    return apiRequest<number>(`${BASE_URL}/unread/count`);
  },

  // Mark a notification as read
  markAsRead: async (notificationId: number) => {
    return apiRequest<any>(`${BASE_URL}/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiRequest<any>(`${BASE_URL}/read-all`, {
      method: 'PUT',
    });
  },

  // Delete a notification
  deleteNotification: async (notificationId: number) => {
    return apiRequest<any>(`${BASE_URL}/${notificationId}`, {
      method: 'DELETE',
    });
  },

  // Show a notification toast
  showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
      default:
        toast.info(message);
        break;
    }
  }
};

export default notificationService;
