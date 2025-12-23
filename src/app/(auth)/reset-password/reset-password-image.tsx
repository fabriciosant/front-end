"use client";

import { Shield, Lock } from "lucide-react";

export default function ResetPasswordImage() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-700 dark:to-purple-800">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="relative h-full flex items-center justify-center p-8 lg:p-12">
          <div className="text-center text-white max-w-lg">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Lock className="h-8 w-8" />
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Segurança em Primeiro Lugar
            </h2>
            <p className="text-lg lg:text-xl opacity-90 mb-8">
              Proteja sua conta com uma senha forte e única
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">1</span>
                </div>
                <span className="text-lg">Use pelo menos 8 caracteres</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">2</span>
                </div>
                <span className="text-lg">Combine letras e números</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">3</span>
                </div>
                <span className="text-lg">Use maiúsculas e minúsculas</span>
              </div>
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5" />
                <p className="text-sm font-medium">Dica de Segurança</p>
              </div>
              <p className="text-sm italic opacity-90">
                Uma senha forte é sua primeira linha de defesa contra ameaças
                online. Nunca compartilhe sua senha com ninguém.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
