// src/components/protected-route.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Verificando autenticação...
          </h1>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, retorna null (será redirecionado pelo useEffect)
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
