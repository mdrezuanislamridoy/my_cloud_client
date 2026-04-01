
export interface DashboardOverview {
  totalStorageAllowed: number;
  totalStorageUsed: number;
  totalFiles: number;
  storageUsagePercentage: number;
  // server actual field names
  totalUsed?: number;
  totalStorage?: number;
  totalFolders?: number;
}

export interface DashboardAnalytics {
  storageHistory: { date: string; usage: number }[];
  fileTypeDistribution: { type: string; count: number }[];
  // server actual field names
  monthlyData?: { months: string; count: number }[];
  monthlyStorageUses?: { months: string; used: number }[];
}

export interface DashboardAnalytics {
  storageHistory: { date: string; usage: number }[];
  fileTypeDistribution: { type: string; count: number }[];
}

export interface DashboardFolder {
  id: string;
  name: string;
  parentId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardApp {
  id: string;
  name: string;
  appId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
