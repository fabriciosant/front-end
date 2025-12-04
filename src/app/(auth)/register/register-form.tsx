"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    passwordConfirmation: false,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      errors.email = "Email inválido";
    }

    if (formData.password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    if (!/[A-Z]/.test(formData.password)) {
      errors.password = "A senha deve conter pelo menos uma letra maiúscula";
    }

    if (!/[0-9]/.test(formData.password)) {
      errors.password = "A senha deve conter pelo menos um número";
    }

    if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = "As senhas não conferem";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await register(
      formData.email,
      formData.password,
      formData.passwordConfirmation
    );

    if (result.success) {
      setTimeout(() => router.push("/dashboard"), 800);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: "",
      });
    }
  };

  const togglePasswordVisibility = (
    field: "password" | "passwordConfirmation"
  ) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 6) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ];
  const strengthLabels = [
    "Muito fraca",
    "Fraca",
    "Média",
    "Forte",
    "Muito forte",
  ];

  const passwordsMatch =
    formData.password === formData.passwordConfirmation &&
    formData.passwordConfirmation.length > 0;

  return (
    <div className="w-full min-h-full flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="relative inline-block mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full blur-lg opacity-50 animate-pulse" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Criar Conta
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">
          Cadastre-se para começar sua jornada financeira
        </p>
      </div>

      {/* Mensagens de erro */}
      {(error || Object.values(validationErrors).some((err) => err)) && (
        <div className="mb-2 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center mb-2">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          )}
          {Object.entries(validationErrors).map(
            ([field, message]) =>
              message && (
                <p
                  key={field}
                  className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {message}
                </p>
              )
          )}
        </div>
      )}

      {/* Formulário */}
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
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-11 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/30 focus:outline-none dark:text-white transition-all duration-300 group-hover:border-emerald-300"
              placeholder="seu@email.com"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Senha
          </label>
          <div className="relative group">
            <input
              id="password"
              name="password"
              type={showPassword.password ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-11 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/30 focus:outline-none dark:text-white transition-all duration-300 group-hover:border-emerald-300"
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("password")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
            >
              {showPassword.password ? (
                <EyeOff className="w-5 h-5 cursor-pointer" />
              ) : (
                <Eye className="w-5 h-5 cursor-pointer" />
              )}
            </button>
          </div>

          {formData.password && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Força da senha:
                </span>
                <span
                  className={`text-xs font-bold ${
                    passwordStrength >= 4
                      ? "text-emerald-600"
                      : passwordStrength >= 3
                      ? "text-green-600"
                      : passwordStrength >= 2
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {strengthLabels[passwordStrength - 1] || strengthLabels[0]}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    strengthColors[passwordStrength - 1] || strengthColors[0]
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="passwordConfirmation"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Confirmar Senha
          </label>
          <div className="relative group">
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type={showPassword.passwordConfirmation ? "text" : "password"}
              required
              value={formData.passwordConfirmation}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-11 bg-white border-2 rounded-xl focus:ring-4 focus:outline-none dark:text-white transition-all duration-300 group-hover:border-emerald-300 ${
                passwordsMatch && formData.passwordConfirmation
                  ? "border-emerald-500 ring-emerald-200"
                  : "border-gray-200 dark:border-gray-600 focus:border-emerald-500"
              }`}
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("passwordConfirmation")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
            >
              {showPassword.passwordConfirmation ? (
                <EyeOff className="w-5 h-5 cursor-pointer" />
              ) : (
                <Eye className="w-5 h-5 cursor-pointer" />
              )}
            </button>
            {passwordsMatch && (
              <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          <div className="relative flex items-center justify-center">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Criando conta...
              </>
            ) : (
              <>Criar Conta</>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </form>

      {/* Link para login - apenas desktop */}
      <div className="hidden md:flex justify-center mt-8">
        <button
          onClick={onSwitchToLogin}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors hover:underline"
        >
          Já tem uma conta? <span className="font-bold">Faça login</span>
        </button>
      </div>
    </div>
  );
}
