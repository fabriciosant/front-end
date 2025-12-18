// src/app/(auth)/confirmation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmToken = async () => {
      const token = searchParams.get("confirmation_token");

      console.log("Token recebido na página:", token); // Para debug

      if (!token) {
        setStatus("error");
        setMessage("Token de confirmação não encontrado.");
        return;
      }

      try {
        // Chama a API do backend para confirmar a conta
        const response = await fetch(
          "http://localhost:3001/api/v1/confirmation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              confirmation_token: token,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Conta confirmada com sucesso!");

          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || data.message || "Falha ao confirmar conta.");
        }
      } catch (error) {
        console.error("Erro na confirmação:", error);
        setStatus("error");
        setMessage("Erro de conexão. Tente novamente.");
      }
    };

    confirmToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Confirmação de Conta
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-2">
              {status === "loading"
                ? "Validando seu email..."
                : "Processo de confirmação"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-4">
              {status === "loading" && (
                <>
                  <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Aguarde, estamos confirmando sua conta...
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Conta Confirmada!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    {message}
                  </p>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 animate-pulse">
                    Redirecionando para login...
                  </div>
                </>
              )}

              {status === "error" && (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Falha na Confirmação
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    {message}
                  </p>
                  <Link href="/">
                    <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-2xl transition-all duration-300">
                      Ir para Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
