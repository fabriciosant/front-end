"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Lock,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";
import api from "@/services/api";
import { Toast } from "@/components/toast";

interface ApiError {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      error?: string | string[];
    };
  };
}

interface TokenValidationResponse {
  valid?: boolean;
  email?: string;
  message?: string;
  error?: string;
}

interface FormData {
  password: string;
  password_confirmation: string;
  reset_password_token: string;
  email: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    password: "",
    password_confirmation: "",
    reset_password_token: "",
    email: "",
  });

  useEffect(() => {
    const token = searchParams.get("reset_password_token");

    if (token) {
      setFormData((prev) => ({
        ...prev,
        reset_password_token: token,
      }));

      // Verificar token com backend
      verifyToken(token);
    } else {
      setIsValidating(false);
      setErrors({
        general: ["Token de redefinição não encontrado no link."],
      });
    }
  }, [searchParams]);

  const verifyToken = async (token: string): Promise<void> => {
    try {
      const response = await api.get<TokenValidationResponse>(
        `/password/edit`,
        {
          params: { reset_password_token: token },
        }
      );

      if (response.data.valid && response.data.email) {
        setFormData((prev) => ({
          ...prev,
          email: response.data.email!,
        }));
        setMessage(null);
        setErrors({});
      } else {
        setErrors({
          general: [response.data.error || "Token inválido ou expirado"],
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao verificar token:", error);
      setErrors({
        general: ["Erro ao validar o token. Tente novamente."],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    if (!formData.password) {
      newErrors.password = ["A senha é obrigatória"];
    } else if (formData.password.length < 8) {
      newErrors.password = ["A senha deve ter pelo menos 8 caracteres"];
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = [
        "A senha deve conter letras maiúsculas, minúsculas e números",
      ];
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = ["Confirme sua senha"];
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = ["As senhas não coincidem"];
    }

    if (!formData.reset_password_token) {
      newErrors.general = ["Token de redefinição inválido ou expirado"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    console.log("DEBUG - Form data:", formData); // Adicione este log

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setMessage(null);

    try {
      // PAYLOAD CORRETO: apenas o objeto "user"
      const payload = {
        user: {
          reset_password_token: formData.reset_password_token,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        },
      };

      console.log("DEBUG - Payload sendo enviado:", payload); // Adicione este log

      // ✅ CORRETO: envia apenas o payload
      const response = await api.put("/password", payload);

      console.log("DEBUG - Resposta:", response.data); // Adicione este log

      if (response.status === 200) {
        setMessage({
          type: "success",
          text: "Senha redefinida com sucesso! Redirecionando para o login...",
        });

        Toast.success({
          title: "Senha alterada!",
          text: "Você já pode fazer login com sua nova senha.",
          position: "top-end",
          timer: 3000,
        });

        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error: unknown) {
      console.error("Erro completo:", error);
      console.error("Dados do erro:", (error as ApiError)?.response?.data);

      const apiError = error as ApiError;
      let errorMessage = "Erro ao redefinir senha. Por favor, tente novamente.";

      if (apiError.response?.data?.errors) {
        setErrors(apiError.response.data.errors);
      } else if (apiError.response?.data?.error) {
        if (Array.isArray(apiError.response.data.error)) {
          errorMessage = apiError.response.data.error.join(", ");
        } else {
          errorMessage = apiError.response.data.error;
        }
        setErrors({ general: [errorMessage] });
      } else {
        setErrors({ general: [errorMessage] });
      }

      Toast.error({
        title: "Falha na redefinição",
        text: errorMessage,
        timer: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpa erros do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const hasMinLength = formData.password.length >= 8;
  const hasLowerCase = /(?=.*[a-z])/.test(formData.password);
  const hasUpperCase = /(?=.*[A-Z])/.test(formData.password);
  const hasNumber = /(?=.*\d)/.test(formData.password);
  const passwordsMatch = formData.password === formData.password_confirmation;

  if (isValidating) {
    return (
      <div className="mt-8">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Validando seu link...
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Por favor, aguarde enquanto verificamos a validade do link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se não há token válido, mostrar mensagem de erro
  if (!formData.reset_password_token || errors.general) {
    return (
      <div className="mt-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            Link Inválido ou Expirado
          </h3>

          <p className="text-red-600 dark:text-red-400 mb-1">
            {errors.general?.[0] ||
              "Este link de redefinição de senha é inválido ou expirou."}
          </p>

          <p className="text-sm text-red-500 dark:text-red-400 mb-6">
            Os links de redefinição são válidos por apenas 6 horas.
          </p>

          <div className="space-y-4">
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Solicitar Novo Link
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {message && (
        <div
          className={`rounded-xl p-4 mb-6 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  message.type === "success"
                    ? "text-green-800 dark:text-green-300"
                    : "text-red-800 dark:text-red-300"
                }`}
              >
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-900 dark:text-primary-200">
              Redefinindo senha para:
            </p>
            <p className="text-sm text-primary-700 dark:text-primary-300 font-semibold">
              {formData.email}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Nova Senha
          </label>
          <div className="relative group">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`block w-full px-4 py-3 pl-11 border-2 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-900/30"
              } rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 sm:text-sm dark:bg-gray-800 dark:text-white transition-all duration-300 group-hover:border-primary-400`}
              placeholder="Digite sua nova senha"
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors" />
              )}
            </button>
          </div>

          {errors.password && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.password[0]}</span>
            </div>
          )}

          {/* Indicadores de força da senha */}
          {formData.password && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {[hasMinLength, hasLowerCase, hasUpperCase, hasNumber].map(
                  (isValid, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isValid
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className={`flex items-center ${
                    hasMinLength
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      hasMinLength ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  8+ caracteres
                </div>
                <div
                  className={`flex items-center ${
                    hasLowerCase
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      hasLowerCase ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  Letra minúscula
                </div>
                <div
                  className={`flex items-center ${
                    hasUpperCase
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      hasUpperCase ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  Letra maiúscula
                </div>
                <div
                  className={`flex items-center ${
                    hasNumber
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      hasNumber ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  Um número
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirmar Nova Senha
          </label>
          <div className="relative group">
            <input
              id="password_confirmation"
              name="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`block w-full px-4 py-3 pl-11 border-2 ${
                errors.password_confirmation
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                  : passwordsMatch && formData.password_confirmation
                  ? "border-green-500 focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-900/30"
                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-900/30"
              } rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 sm:text-sm dark:bg-gray-800 dark:text-white transition-all duration-300 group-hover:border-primary-400`}
              placeholder="Digite a senha novamente"
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors" />
              )}
            </button>
            {passwordsMatch && formData.password_confirmation && (
              <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>

          {errors.password_confirmation && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.password_confirmation[0]}</span>
            </div>
          )}

          {passwordsMatch && formData.password_confirmation && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Senhas coincidem</span>
            </div>
          )}
        </div>

        {errors.general && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  {errors.general[0]}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative cursor-pointer overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <div className="relative flex items-center justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redefinindo senha...
                </>
              ) : (
                <>Redefinir Senha</>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors hover:underline"
          >
            ← Voltar para o login
          </Link>
        </div>
      </form>
    </div>
  );
}
