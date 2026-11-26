const DEFAULT_RETURN_URL = "/dashboard";

/**
 * Valida un `returnUrl` recibido por query string para evitar open redirects.
 * Solo se aceptan rutas internas (empiezan con `/` y no con `//`).
 */
export const getSafeReturnUrl = (
  value: unknown,
  fallback: string = DEFAULT_RETURN_URL
): string => {
  if (typeof value !== "string") {
    return fallback;
  }

  const candidate = value.trim();

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  // Descarta rutas con backslashes o caracteres de control, que algunos
  // navegadores interpretan como `//` al normalizar la URL.
  // eslint-disable-next-line no-control-regex
  if (/[\\\u0000-\u001f]/.test(candidate)) {
    return fallback;
  }

  return candidate;
};
