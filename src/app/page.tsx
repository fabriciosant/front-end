//src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import LoginForm from "./(auth)/login/login-form";
import LoginImage from "./(auth)/login/login-image";
import RegisterForm from "./(auth)/register/register-form";
import RegisterImage from "./(auth)/register/register-image";

export default function Home() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      router.push("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const toggleMode = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setIsLoginMode(!isLoginMode);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 50);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Verificando autenticação...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Elementos decorativos - apenas desktop */}
      <div className="absolute top-10 left-10 hidden md:block">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg rotate-12 animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-10 right-10 hidden md:block">
        <Sparkles className="w-8 h-8 text-purple-500 animate-spin-slow" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          {/* Container principal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex min-h-[600px] h-[600px]">
            {/* Container do formulário (100% no mobile, 50% no desktop) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              {/* Formulário Login */}
              <div
                className={`h-full flex flex-col justify-center transition-all duration-500 ease-in-out ${
                  isLoginMode
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full absolute"
                }`}
              >
                <LoginForm onSwitchToRegister={toggleMode} />
              </div>

              {/* Formulário Register */}
              <div
                className={`h-full flex flex-col justify-center transition-all duration-500 ease-in-out ${
                  !isLoginMode
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full absolute"
                }`}
              >
                <RegisterForm onSwitchToLogin={toggleMode} />
              </div>
            </div>

            {/* Container da imagem (apenas desktop) */}
            <div className="hidden md:block w-1/2 relative overflow-hidden">
              {/* Background gradiente */}
              <div
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isLoginMode
                    ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
                    : "bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500"
                }`}
              >
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Imagem Login */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  isLoginMode
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <div className="h-full flex flex-col justify-center p-8">
                  <LoginImage onSwitchToRegister={toggleMode} />
                </div>
              </div>

              {/* Imagem Register */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  !isLoginMode
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
                }`}
              >
                <div className="h-full flex flex-col justify-center p-8">
                  <RegisterImage onSwitchToLogin={toggleMode} />
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Controle Financeiro. Todos os
              direitos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Animações CSS */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Animações para mobile */
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
