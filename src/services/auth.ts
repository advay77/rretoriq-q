import api, { handleApiError } from '../lib/api'
import type { ApiResponse, User } from '../lib/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', credentials)
      const { accessToken, user } = response.data.data!
      
      localStorage.setItem('accessToken', accessToken)
      return { accessToken, user }
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
      const { accessToken, user } = response.data.data!
      
      localStorage.setItem('accessToken', accessToken)
      return { accessToken, user }
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('accessToken')
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me')
      return response.data.data!
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
      const { accessToken } = response.data.data!
      
      localStorage.setItem('accessToken', accessToken)
      return accessToken
    } catch (error) {
      localStorage.removeItem('accessToken')
      throw new Error(handleApiError(error))
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken')
  }
}

export const authService = new AuthService()
export default authService