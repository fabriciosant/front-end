// src/hooks/use-auth.ts
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/api';
import { AxiosError } from 'axios';

interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  message: string;
}

interface ErrorResponse {
  error?: string;
  errors?: string[];
  message?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const isAuthenticated = useCallback(() => {
    // Verifica se existe token e user no localStorage
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuthResponse = await authService.login({ email, password });
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      return { success: true, data: response };
    } catch (err: unknown) {
      let errorMessage = 'Erro ao fazer login';
      
      if (err instanceof AxiosError) {
        const data = err.response?.data as ErrorResponse;
        errorMessage = data?.error || data?.errors?.[0] || data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, passwordConfirmation: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuthResponse = await authService.register({
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      return { success: true, data: response };
    } catch (err: unknown) {
      let errorMessage = 'Erro ao criar conta';
      
      if (err instanceof AxiosError) {
        const data = err.response?.data as ErrorResponse;
        errorMessage = data?.error || data?.errors?.[0] || data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
  try {
    await authService.logout();
  } catch {
    // Ignora erros
  } finally {
    // Remove do localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Remove cookies
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Limpa estado
    setUser(null);
    setError(null);
    
    // Redireciona
    window.location.href = '/login';
  }
}, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };
};