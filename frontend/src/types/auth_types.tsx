export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error: string[];
}


export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}


export interface RegisterResponse {
  id?: number;
  name: string;
  username: string;
  email: string;
}


export interface MeResponse {
  id: number;
  name: string;
  username: string;
  email: string;
}