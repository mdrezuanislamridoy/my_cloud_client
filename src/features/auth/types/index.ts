export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profilePic?: string;
  accountType?: string;
  isEmailVerified?: boolean;
  created_at?: string;
}

// Server wraps all responses as: { success, message, data: { ... } }
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse extends ApiResponse<{
  accessToken: string;
  user: User;
}> {}

export interface RegisterResponse extends ApiResponse<{
  token: string;
}> {}

export interface ProfileResponse extends ApiResponse<User> {}
