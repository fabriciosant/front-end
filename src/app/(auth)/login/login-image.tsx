// src/app/(auth)/login/login-image.tsx
import { Check } from "lucide-react";

interface LoginImageProps {
  onSwitchToRegister: () => void;
}

export default function LoginImage({ onSwitchToRegister }: LoginImageProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-white">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
          <p className="text-lg opacity-90">
            Gerencie suas finanças de forma inteligente e segura
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-300" />
            <span>Criptografia de ponta a ponta</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-300" />
            <span>Análises detalhadas e insights</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-300" />
            <span>Sincronização em tempo real</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSwitchToRegister}
        className="mt-12 bg-white/20 cursor-pointer hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2"
      >
        Criar Conta
      </button>
    </div>
  );
}
