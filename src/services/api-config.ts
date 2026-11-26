/**
 * URL base de la API. Debe incluir el prefijo `/api`.
 *
 * En desarrollo local apunta al mock incluido en el repo (`npm run mock`).
 * En producción usa el backend desplegado, y permite sobreescribirlo desde
 * `VITE_API_URL` o `NEXT_PUBLIC_API_URL`.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://cpm-api-production.up.railway.app/api"
    : "http://localhost:4000/api");

/** Nombre del header que espera la API para el token de sesión. */
export const AUTH_HEADER = "cpm_user_app_token";

/** Llave de localStorage donde se guarda el token de sesión. */
export const ACCESS_TOKEN_KEY = "accessToken";

/**
 * Solo desarrollo: el mock devuelve el token de verificación para poder
 * probar el flujo sin un servidor de correo. Nunca lo devuelve la API real.
 */
export const MOCK_VERIFICATION_TOKEN_KEY = "mockVerificationToken";

/**
 * Endpoints que nunca deben recibir el token de sesión almacenado.
 * Se comparan por ruta (sin query string) usando `endsWith`.
 */
export const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/users/verify-email",
];
