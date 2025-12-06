// src/hooks/use-auth.ts
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/api';
import { AxiosError } from 'axios';
import { Toast } from '@/components/toast'; 

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
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
      // Primeiro tenta fazer logout na API
      await authService.logout();
      
      // Remove tokens do localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Limpa o estado
      setUser(null);
      setError(null);
      
      // Mostra toast de sucesso
      Toast.success({
        title: "Logout realizado",
        text: "Você foi desconectado com sucesso",
        timer: 2000,
      });
      
      return { success: true, message: 'Logout realizado com sucesso' };
    } catch (err: unknown) {
      // Mesmo se a API falhar, limpa os dados locais
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      
      let errorMessage = 'Erro ao fazer logout';
      
      if (err instanceof AxiosError) {
        const data = err.response?.data as ErrorResponse;
        errorMessage = data?.error || data?.errors?.[0] || data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Toast de aviso (não erro, pois ainda limpamos os dados locais)
      Toast.info({
        title: "Sessão encerrada localmente",
        text: "Sua sessão foi encerrada, mas houve um problema ao notificar o servidor",
        timer: 3000,
      });
      
      return { 
        success: true, // Ainda consideramos sucesso pois os dados foram limpos
        message: 'Sessão encerrada localmente',
        error: errorMessage 
      };
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};