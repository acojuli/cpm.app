# Mock de la API de CPM

Servidor HTTP sin dependencias que implementa el contrato mínimo de autenticación
para desarrollar y probar el frontend sin el backend real (que hoy está caído).

## Uso

```bash
# Node 18-20 (ver .nvmrc)
npm run mock
```

Queda escuchando en `http://localhost:4000/api`.
El frontend debe apuntar ahí:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Credenciales demo

| Email          | Contraseña   | Estado         |
| -------------- | ------------ | -------------- |
| `demo@cpm.la`  | `Password1!` | Ya verificado  |

También se puede registrar un usuario nuevo; queda con `active: false` hasta
verificar el email.

## Flujo de verificación / reseteo

El mock no envía emails. Al registrarse (o al pedir un reseteo) imprime en la
consola un link como:

```
[mock] Verificación de nuevo@cpm.la: http://localhost:3000/verify-email?token=verify_...
[mock] Reseteo de nuevo@cpm.la: http://localhost:3000/reset-password?token=reset_...
```

Para pruebas automatizadas también se puede consultar el último link generado:

```bash
curl http://localhost:4000/api/__mock/state
```

## Endpoints implementados

| Método | Ruta                          | Auth | Descripción                                      |
| ------ | ----------------------------- | ---- | ------------------------------------------------ |
| POST   | `/auth/register`              | No   | Crea usuario inactivo y genera token de verify   |
| POST   | `/auth/login`                 | No   | Devuelve `{ token, user }`                       |
| POST   | `/auth/reset-password`        | No   | Solicita reseteo por email (token por consola)   |
| GET    | `/users`                      | Sí   | Usuario autenticado (`UserDetail`)               |
| POST   | `/users/verify-email?token=`  | No   | Activa el email                                  |
| POST   | `/users/resend-verification`  | Sí   | Regenera el token de verificación                |
| POST   | `/users/reset-password?token=`| No   | Define la nueva contraseña con token             |
| POST   | `/users/reset-password`       | Sí   | Cambio de contraseña con `password_old`          |
| GET    | `/orders`, `/funds`           | No   | Respuestas vacías para el dashboard              |
| GET    | `/__health`                   | No   | Healthcheck                                      |
| GET    | `/__mock/state`               | No   | Estado interno y últimos links (solo mock)        |
| POST   | `/__mock/reset`               | No   | Reinicia el estado (solo mock)                   |

El token de sesión viaja en el header `cpm_user_app_token`. Los endpoints de
verificación y reseteo reciben su token en el query string `?token=`.

## Variables de entorno

| Variable          | Default                 | Descripción                        |
| ----------------- | ----------------------- | ---------------------------------- |
| `MOCK_API_PORT`   | `4000`                  | Puerto del mock                    |
| `MOCK_APP_URL`    | `http://localhost:3000` | Base usada para armar los links    |
