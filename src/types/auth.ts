// Auth related types
export interface AuthUser {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  roleId?: number;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  loading: boolean;
  error: string | null;
}

// API Request/Response types
export interface LoginRequest {
  UsernameOrEmail: string;
  Password: string;
  RememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegistrationRequest {
  Email: string;
}

export interface ForgotPasswordRequest {
  Email: string;
}

export interface ResetPasswordRequest {
  Token: string;
  NewPassword: string;
}

export interface CompleteRegistrationRequest {
  Token: string;
  Password: string;
  Username?: string;
  FirstName: string;
  LastName: string;
  CompanyName?: string;
  Email: string;
}
