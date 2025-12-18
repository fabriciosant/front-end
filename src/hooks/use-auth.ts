// src/hooks/use-auth.ts
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/api';
import { AxiosError } from 'axios';

interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  confirmation_sent_at?: string;
}

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user: User;
  message: string;
  requires_confirmation?: boolean;
  confirmation_sent_at?: string;
}

interface ErrorResponse {
  error?: string;
  errors?: string[];
  message?: string;
}

interface RegisterResult {
  success: boolean;
  requiresConfirmation?: boolean;
  message?: string;
  error?: string;
  data?: AuthResponse;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

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
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuthResponse = await authService.login({ email, password });

      console.log("Resposta do login:", response);
      
      localStorage.setItem('access_token', response.access_token!);
      localStorage.setItem('refresh_token', response.refresh_token!);
      localStorage.setItem('user', JSON.stringify(response.user));

      const userData = JSON.stringify(response.user);
      document.cookie = `access_token=${response.access_token}; path=/; max-age=${60 * 60 * 24}`;
      document.cookie = `user=${encodeURIComponent(userData)}; path=/; max-age=${60 * 60 * 24}`;
      
      setUser(response.user);
      return { success: true, data: response };
    } catch (err: unknown) {
      console.log("Erro no login:", err);
      let errorMessage = 'Erro ao fazer login';
      
      if (err instanceof AxiosError) {
        const data = err.response?.data as ErrorResponse;
        errorMessage = data?.error || data?.errors?.[0] || data?.message || errorMessage;
     
        if (err.response?.status === 422 && data.error?.includes('confirm')) {
          return {
            success: false,
            requiresConfirmation: true,
            error: errorMessage
          };
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, passwordConfirmation: string): Promise<RegisterResult> => {
    try {
      setLoading(true);
      setError(null);
      setRequiresConfirmation(false);
      
      const response: AuthResponse = await authService.register({
        email,
        password,
        password_confirmation: passwordConfirmation
      });
    
      if (response.requires_confirmation) {
        setRequiresConfirmation(true);
        setConfirmationEmail(email);
        
        return {
          success: true,
          requiresConfirmation: true,
          message: response.message,
          data: response
        };
      }
      
      if (response.access_token && response.refresh_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      return {
        success: true,
        requiresConfirmation: false,
        message: response.message,
        data: response
      };
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

  const confirmAccount = useCallback(async (token: string): Promise<RegisterResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.confirmAccount(token);
      
      return {
        success: true,
        message: response.message || 'Conta confirmada com sucesso!'
      };
    } catch (err: unknown) {
      let errorMessage = 'Erro ao confirmar conta';
      
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

  const resendConfirmation = useCallback(async (email: string): Promise<RegisterResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.resendConfirmation(email);
      
      return {
        success: true,
        message: response.message || 'Email de confirmação reenviado!'
      };
    } catch (err: unknown) {
      let errorMessage = 'Erro ao reenviar confirmação';
      
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
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      setUser(null);
      setError(null);
      setRequiresConfirmation(false);
      setConfirmationEmail(null);
      
      window.location.href = '/';
    }
  }, []);

  return {
    user,
    loading,
    error,
    requiresConfirmation,
    confirmationEmail,
    login,
    register,
    logout,
    confirmAccount,  
    resendConfirmation, 
    isAuthenticated
  };
};