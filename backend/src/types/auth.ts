import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
} 