// src/app/(auth)/register/register-image.tsx
import { Check } from "lucide-react";

interface RegisterImageProps {
  onSwitchToLogin: () => void;
}

export default function RegisterImage({ onSwitchToLogin }: RegisterImageProps) {
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Comece sua jornada!</h2>
          <p className="text-lg opacity-90">
            Crie sua conta e tenha total controle sobre seu dinheiro
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-300" />
            <span>Controle total das suas finanças</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-300" />
            <span>Metas e planejamento financeiro</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-300" />
            <span>Relatórios detalhados e insights</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSwitchToLogin}
        className="mt-12 bg-white/20 cursor-pointer hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2"
      >
        Já tem conta? Fazer Login
      </button>
    </div>
  );
}
