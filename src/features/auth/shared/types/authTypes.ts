export interface ApiStatus {
  code: number;
  isSuccess: boolean;
}

export interface ApiResponse<T> {
  status: ApiStatus;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_type: string;
  roleName?: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  session_token: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface VerifyOtpResponse {
  session_token: string;
}

export interface CompleteRegistrationRequest {
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  school_name: string;
  city_id: string;
  year: number;
}

export interface CompleteRegistrationResponse {
  token: string;
  user_type: string;
}

export interface AuthUser {
  id: string;
  email: string;
  avatar?: string;
  user_type?: string;
  role?: string;
  roleName?: string;
  school_name?: string;
  city_id?: string;
  year?: number;
}

export interface RegistrationState {
  step: "email" | "otp" | "profile" | "complete";
  email: string;
  sessionToken: string;
  profileData: Partial<CompleteRegistrationRequest>;
}

export interface City {
  id: string;
  name: string;
  province?: string;
}
