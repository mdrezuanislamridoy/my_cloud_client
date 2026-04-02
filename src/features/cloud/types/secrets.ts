export interface SecretKey {
  id?: string;
  userId?: string;
  secretKey?: string;   // api_secret (sk_...)
  apiKey?: string;      // api_key (ak_...)
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppId {
  id: string;
  userId: string;
  name: string;
  appId: string;
  createdAt: string;
  updatedAt: string;
}
