"use client";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Tipos de toast
type ToastType = "success" | "error" | "warning" | "info" | "question";

// Interface para as opções do toast
interface ToastOptions {
  title: string;
  text?: string; // Adicionado para texto adicional
  timer?: number;
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
}

// Configuração padrão do Toast
export const Toast = {
  // Método para criar o toast básico
  fire: (options: ToastOptions & { icon: ToastType }) => {
    const {
      title,
      text,
      icon,
      timer = 3000,
      position = "top-end",
      showConfirmButton = false,
      confirmButtonText = "OK",
      confirmButtonColor = "#059669",
      showCancelButton = false,
      cancelButtonText = "Cancelar",
    } = options;

    return MySwal.mixin({
      toast: true,
      position,
      icon,
      title,
      text,
      showConfirmButton,
      showCancelButton,
      confirmButtonText,
      confirmButtonColor,
      cancelButtonText,
      timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: {
        popup: "sweet-alert-popup",
        title: "sweet-alert-title",
        icon: "sweet-alert-icon",
      },
    }).fire();
  },

  // Métodos para cada tipo de toast
  success: (options: ToastOptions) => {
    return Toast.fire({
      ...options,
      icon: "success",
      confirmButtonColor: "#059669",
    });
  },

  error: (options: ToastOptions) => {
    return Toast.fire({
      ...options,
      icon: "error",
      confirmButtonColor: "#dc2626",
    });
  },

  warning: (options: ToastOptions) => {
    return Toast.fire({
      ...options,
      icon: "warning",
      confirmButtonColor: "#f59e0b",
    });
  },

  info: (options: ToastOptions) => {
    return Toast.fire({
      ...options,
      icon: "info",
      confirmButtonColor: "#2563eb",
    });
  },

  question: (options: ToastOptions) => {
    return Toast.fire({
      ...options,
      icon: "question",
      confirmButtonColor: "#7c3aed",
    });
  },

  // Método para diálogo de confirmação
  confirm: (
    options: ToastOptions & {
      onConfirm: () => void;
      onCancel?: () => void;
    }
  ) => {
    const { onConfirm, onCancel, ...rest } = options;

    return MySwal.fire({
      ...rest,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: rest.confirmButtonText || "Sim",
      cancelButtonText: rest.cancelButtonText || "Não",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#dc2626",
      customClass: {
        popup: "sweet-alert-popup",
        confirmButton: "sweet-alert-confirm-btn",
        cancelButton: "sweet-alert-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      } else if (result.isDismissed && onCancel) {
        onCancel();
      }
    });
  },

  // Método para loading
  loading: (title: string = "Carregando...") => {
    return MySwal.fire({
      title,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        MySwal.showLoading();
      },
    });
  },

  // Método para fechar toast
  close: () => {
    MySwal.close();
  },
};
