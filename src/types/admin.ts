import type { User } from './auth';

export interface AdminUser extends User {
  isBlocked: boolean;
  _count?: { files: number };
  subscription?: { plan?: { name: string } };
}

export interface AdminSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description?: string;
  storageLimit: number;
  fileLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalStorageUsed: number;
}
