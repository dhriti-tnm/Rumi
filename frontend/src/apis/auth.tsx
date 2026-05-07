import { apiClient } from "./client";
import type { ApiResponse, LoginResponse, RegisterResponse, MeResponse } from "../types/auth_types";


export const login = (username: string, password: string) => {
  return apiClient.post<ApiResponse<LoginResponse>>("/auth/login", {
    username,
    password,
  });
};


export const register = ( name: string, username: string, email: string, password: string ) => {
  return apiClient.post<ApiResponse<RegisterResponse>>("/auth/register", {name,username,email,password,});
};


export const getMe = () => {
  return apiClient.get<ApiResponse<MeResponse>>("/auth/me");
};

export const logout = () => {
  return apiClient.post<ApiResponse<null>>("/auth/logout");
};