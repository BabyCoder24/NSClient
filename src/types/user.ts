export interface User {
  id: number;
  firstName: string;
  lastName: string;
  companyName?: string;
  username: string;
  email: string;
  roleId: number;
  clientId?: number;
  isVerified: boolean;
  createdAt: string; // ISO date string
  updatedAt?: string;
  roleName?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  companyName?: string;
  username: string;
  email: string;
  roleId: number;
  clientId?: number;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateUserRequest {
  id: number;
  firstName: string;
  lastName: string;
  companyName?: string;
  username: string;
  email: string;
  isVerified?: boolean;
  roleId: number;
  clientId?: number;
}
