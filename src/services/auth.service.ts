import { api } from './api';

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface SignInResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: UserData;
}

export interface SignUpResponse {
  message: string;
  email: string;
}

export const authService = {
  async login(email: string, password: string): Promise<SignInResponse> {
    const response = await api.post<SignInResponse>('/signin', {
      email,
      password,
    });
    return response.data;
  },

  async register(name: string, email: string, password: string): Promise<SignUpResponse> {
    const response = await api.post<SignUpResponse>('/signup', {
      name,
      email,
      password,
    });
    return response.data;
  },
};
