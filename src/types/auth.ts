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
  token: string | null;
  loading: boolean;
  error: string | null;
}

// API Request/Response types
export interface LoginRequest {
  UsernameOrEmail: string;
  Password: string;
}

export interface LoginResponse {
  Token: string;
}

export interface RegistrationRequest {
  FirstName: string;
  LastName: string;
  CompanyName?: string;
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
}
