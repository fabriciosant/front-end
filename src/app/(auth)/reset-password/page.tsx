"use client";

import { Suspense } from "react";
import ResetPasswordForm from "../reset-password/reset-password-form";
import ResetPasswordImage from "../reset-password/reset-password-image";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Redefinir Senha
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Digite sua nova senha abaixo
            </p>
          </div>

          <Suspense
            fallback={
              <div className="mt-8 space-y-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                </div>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1">
        <ResetPasswordImage />
      </div>
    </div>
  );
}
