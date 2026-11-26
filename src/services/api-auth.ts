import axios from "axios";
import ApiClient from "./api-client";
import { RegisterResponse } from "../types/register";
import { User } from "src/types/user-data";
import { UserDetail } from "src/types/user-data/user-detail";

export interface VerifyEmailResponse {
  active: boolean;
  message?: string;
}

/**
 * El mock agrega `mock_verification_token` para poder verificar sin email.
 * La API real no incluye ese campo.
 */
export type RegisterApiResponse = RegisterResponse & {
  mock_verification_token?: string;
};

export type ResendVerificationResponse = {
  message?: string;
  mock_verification_token?: string;
};

const TIMEOUT_MESSAGE = "El servidor tardó demasiado en responder";

/**
 * Normaliza cualquier error de la API a un `Error` con un mensaje legible.
 * La API puede responder `{ error }` o `{ message }`.
 */
export const toApiError = (
  err: unknown,
  fallback = "Error de servidor"
): Error => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { error?: string; message?: string }
      | undefined;
    const message =
      data?.error ||
      data?.message ||
      (err.code === "ECONNABORTED" ? TIMEOUT_MESSAGE : undefined) ||
      (err.message === "Network Error"
        ? "No se pudo conectar con el servidor"
        : undefined) ||
      fallback;

    return new Error(message);
  }

  if (err instanceof Error && err.message) {
    return err;
  }

  return new Error(fallback);
};

class AuthApi {
  async login(userLoginData: {
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const response = await ApiClient.post("/auth/login", userLoginData);
      return response.data as User;
    } catch (err) {
      throw toApiError(err, "No se pudo iniciar sesión");
    }
  }

  async register(userRegisterData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }): Promise<RegisterApiResponse> {
    try {
      const response = await ApiClient.post("/auth/register", userRegisterData);
      return response.data as RegisterApiResponse;
    } catch (err) {
      throw toApiError(err, "No se pudo crear la cuenta");
    }
  }

  async me(): Promise<UserDetail> {
    try {
      const response = await ApiClient.get("/users");
      return response.data as UserDetail;
    } catch (err) {
      throw toApiError(err, "No se pudo obtener el usuario");
    }
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await ApiClient.postWithToken(
        "/users/verify-email",
        { token },
        token
      );
      return response.data as VerifyEmailResponse;
    } catch (err) {
      throw toApiError(err, "No se pudo verificar el email");
    }
  }

  async resendVerification(): Promise<ResendVerificationResponse> {
    try {
      const response = await ApiClient.post("/users/resend-verification", {});
      return response.data as ResendVerificationResponse;
    } catch (err) {
      throw toApiError(err, "No se pudo reenviar el email de verificación");
    }
  }
}

export const authApi = new AuthApi();
