/**
 * Política de contraseñas única para registro y reseteo.
 * Debe mantenerse alineada con la validación del backend.
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*._-]).{8,64}$/;

export const PASSWORD_POLICY_MESSAGE =
  "La contraseña debe tener entre 8 y 64 caracteres e incluir al menos una mayúscula, una minúscula, un número y un símbolo (!@#$%^&*._-)";
