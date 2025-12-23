"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, Check, ArrowLeft } from "lucide-react";
import api from "@/services/api";
import { Toast } from "@/components/toast";

interface ApiError {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      error?: string;
      message?: string;
    };
  };
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) {
      setValidationError("Email é obrigatório");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Digite um email válido");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setIsLoading(true);

    try {
      const response = await api.post("/password", {
        user: {
          email: email,
        },
      });

      if (response.status === 200) {
        setEmailSent(true);

        Toast.success({
          title: "Email enviado com sucesso!",
          text: "Verifique sua caixa de entrada e pasta de spam.",
          position: "top-end",
          timer: 5000,
        });

        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error: unknown) {
      console.error("Erro ao solicitar redefinição:", error);

      const apiError = error as ApiError;
      let errorMessage =
        "Erro ao enviar email de redefinição. Tente novamente.";

      if (apiError.response?.data?.errors?.email) {
        errorMessage = apiError.response.data.errors.email[0];
      } else if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }

      Toast.error({
        title: "Falha no envio",
        text: errorMessage,
        timer: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError("");
    }
    if (emailSent) {
      setEmailSent(false);
    }
  };

  const isValidEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-900 dark:to-primary-900/10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Recuperar Senha
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1 font-normal">
            Digite seu email para receber o link de redefinição
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          {emailSent ? (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Check className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Email Enviado!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enviamos um link de redefinição para:
                  <br />
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {email}
                  </span>
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>• O link é válido por 6 horas</p>
                  <p>• Verifique sua pasta de spam</p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                    Redirecionando em alguns segundos...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full px-4 py-3 pl-11 bg-white dark:bg-gray-700 border-2 ${
                        validationError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                          : isValidEmail() && email
                          ? "border-primary-500 ring-primary-200"
                          : "border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-900/30"
                      } rounded-xl focus:ring-4 focus:outline-none dark:text-white transition-all duration-300 group-hover:border-primary-300`}
                      placeholder="example@email.com"
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    {isValidEmail() && email && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  {validationError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative cursor-pointer overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="relative flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>Enviar Link de Redefinição</>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </form>

              <div className="flex justify-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para o login
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  O link será válido por 6 horas.
                  <br />
                  Verifique também sua pasta de spam.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
