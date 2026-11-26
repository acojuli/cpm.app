# Análisis del proyecto CPM App

Fecha del análisis: 2026-11-20
Repo: https://github.com/acojuli/cpm.app
Rama analizada: `develop` (último commit `ef87271`, 2024-03-24)

---

## 1. Resumen ejecutivo

El proyecto es un frontend Next.js 12 (Pages Router, React 17, MUI 5 alpha, Redux Toolkit)
de una plataforma de inversiones cripto. Tiene 293 archivos TS/TSX (~14.300 líneas),
21 páginas y 115 componentes. Compila correctamente **solo con Node 16/18/20**.

El "login no funcionaba del todo bien" no es un único bug: hay **tres causas
independientes** que se suman.

1. **El backend está caído.** `https://cpm-tst.onrender.com/api` responde 404 de
   Cloudflare en todas las rutas y el dominio `cpm.la` ya no resuelve por DNS.
   Sin API, ningún login puede funcionar.
2. **Node 26 rompe Next 12.** Con el Node instalado en la máquina (v26.13.0),
   `next dev` y `next build` crashean al cargar `jsonwebtoken` compilado.
   Verificado: con Node 20.18.1 compila y corre sin cambios.
3. **El flujo de auth tiene bugs funcionales propios** (registro, verificación de
   email, reset de contraseña, logout) que sobreviven incluso con un backend sano.

Además, el trabajo real está en `develop`, pero el repositorio tiene como rama
por defecto una feature de octubre 2023. No existe `main`. Hay 92 ramas remotas,
la mayoría ya integradas.

---

## 2. Estado del repositorio y del entorno

| Ítem | Estado |
|---|---|
| Rama por defecto del repo | `Botones-home-card-plan-redireccion` (2023-10-27) |
| Rama con el trabajo más reciente | `develop` (2024-03-24) |
| `main` | No existe |
| Último commit | "fix en verificacion exitosa (#114)" |
| Build | Falla en Node 26, OK en Node 20.18.1 |
| Typecheck (`tsc --noEmit`) | OK |
| Lint | Config laxa, sin CI |
| Tests | Ninguno |
| Variables de entorno | Ninguna; la URL de API está hardcodeada |
| Vulnerabilidades npm (prod) | 87 (4 críticas, 35 altas) |

Verificación del build con Node 20:

```
✔ Compiled successfully
✔ Generating static pages (15/15)
```

Verificación del error con Node 26:

```
TypeError: Cannot read properties of undefined (reading 'prototype')
    at 311 (node_modules/next/dist/compiled/jsonwebtoken/index.js:1:414)
```

> Recomendación: fijar Node 20 con `.nvmrc` / `engines` y usar `nvm` o similar.

---

## 3. Arquitectura de autenticación (tal como está)

- `AuthProvider` (`src/contexts/jwt-context.tsx`) mantiene `isInitialized`,
  `isAuthenticated` y `user` en un reducer local.
- El token se guarda en `localStorage.accessToken`.
- `api-client.ts` inyecta el token en el header `cpm_user_app_token`.
- `AuthGuard` / `GuestGuard` protegen páginas privadas / públicas.
- Redux guarda una copia del usuario (`user-slice`) que consumen los componentes.
- Al iniciar la app, si hay token se llama `GET /users` y se bloquea **todo** el
  sitio con `SplashScreen` hasta que responda (`_app.tsx:69`).

Problemas estructurales del diseño:

- Hay dos fuentes de verdad para el usuario (Context + Redux) que se
  desincronizan (ver bugs 2, 3 y 4).
- No hay refresh token, ni manejo de 401, ni expiración.
- La URL de la API está hardcodeada en dos archivos.

---

## 4. Hallazgos del flujo de login

### Bloqueantes

**B1. Backend inexistente**
`src/services/api-client.ts:3` y `src/services/api-client-without-token.ts:3`
apuntan a `https://cpm-tst.onrender.com/api`, que devuelve 404 en `/`, `/api`,
`/api/health` y `/api/auth/login`. `cpm.la` no tiene DNS.
No hay variable de entorno alternativa.

**B2. Node incompatible**
Next 12 no soporta Node 22+. El proyecto no arranca con el Node actual.

**B3. Rama por defecto desactualizada**
Quien clone el repo obtiene una versión de 2023 sin verificación de email ni
los últimos fixes. Todo el trabajo está en `develop` y nunca se mergeó a una
`main`.

### Bugs funcionales (verificados en navegador)

**A1. Registro no actualiza Redux → email vacío en la pantalla de verificación**
`register()` (`jwt-context.tsx:178-200`) guarda el token y actualiza el Context,
pero **no** hace `reduxDispatch(setUser(...))`.
Resultado real: tras registrarse, `/email-verification` muestra
"Te enviamos un email a:" seguido de nada.
Evidencia: `POST /auth/register` 200 → `POST /auth/login` 200 → pantalla sin email.

**A2. La verificación de email entra en loop y nunca termina**
`/verify-email` hace `POST /users/verify-email` con éxito y luego
`router.push('/dashboard')`. Pero `AuthGuard` lee `user.active` desde Redux,
que sigue en `false` porque nadie refresca el usuario.
Resultado real: URL final `/email-verification?returnUrl=%2Fdashboard`,
aunque el backend ya activó la cuenta.
Además el `<title>` de la página hereda "Register | Invierte en Cripto".

**A3. "Reenviar email" no hace nada**
`src/pages/email-verification/index.tsx:14` → `handleResendEmail = () => {}`.

**A4. El reset de contraseña con token es inutilizable**
La página `/reset-password?token=...` renderiza `FormChangePassword`
(`src/pages/reset-password/index.tsx:40`), que **exige la contraseña actual**
(`form-change-password.tsx:25-27`) y la envía como `password_old`.
Un usuario que olvidó su contraseña no puede completar el formulario.
Ya existe el componente correcto (`account/mobile/security/form-reset-password.tsx`,
sin `password_old`), pero no está conectado a esa página.
Verificado: el formulario muestra "Contraseña actual" en `/reset-password?token=xyz`.

**A5. El logout no limpia Redux**
`logout()` (`jwt-context.tsx:173`) borra el token y el Context, pero nunca
despacha `clearUser` (definido en `user-slice.ts:57` y sin usar en todo el repo).
Los componentes que leen `state.user` siguen mostrando datos del usuario anterior.

**A6. Open redirect en el login**
`jwt-login.tsx:38` hace `router.push(returnUrl)` con el valor de la query sin validar.
Verificado: `/login?returnUrl=https://example.com` termina en `example.com`
después de autenticarse. Vector de phishing.

**A7. Errores de registro y de `/users` enmascarados**
`api-auth.ts:40` y `api-auth.ts:56` tienen el typo `err?.reponse` (falta la `s`).
Por eso `register()` y `me()` siempre devuelven "Error de servidor" y nunca el
mensaje real del backend (p. ej. "el email ya está registrado").

**A8. Token viejo se envía en endpoints públicos**
El interceptor (`api-client.ts:5-16`) inyecta `cpm_user_app_token` en **todas**
las requests, incluidos `/auth/login`, `/auth/register` y `/auth/reset-password`.
Si queda un token vencido en `localStorage`, el backend puede rechazar el login
por token inválido antes de validar las credenciales. Hipótesis muy probable del
síntoma "a veces no puedo volver a entrar" (no verificable sin el backend).
Verificado que el header se envía: `POST /auth/reset-password` salió con
`token= mock-token-123` desde una sesión previa.

**A9. El interceptor pisa todos los headers**
`config.headers = { ... }` reemplaza el objeto completo en lugar de mergear.
Además, si la request tiene `params`, usa `params.token` como token y descarta
el de `localStorage`.

**A10. `firstname` arranca con un espacio y no es obligatorio**
`jwt-register.tsx:32` → `firstname: " "`.
Verificado: se registró un usuario con `"firstname": ""` sin que la validación
lo impidiera. También `type="firstname"` y `type="lastname"` son tipos inválidos.

**A11. Reglas de contraseña incompatibles**
- Registro: 10–15 caracteres, mayúscula, minúscula, número y símbolo
  (`jwt-register.tsx:46-49`).
- Reset/seguridad: 8–20 caracteres, otro set de símbolos
  (`form-change-password.tsx:31-34`).
Un usuario puede crear una clave válida para registro e inválida para reset.

**A12. "Recuerdame" no hace nada**
El checkbox existe (`jwt-login.tsx:132-137`) pero el token siempre va a
`localStorage` (persistente).

**A13. Mensajes y navegación inconsistentes**
- "Recibirás un correo para cambiar tu email" en el flujo de contraseña
  (`form-reset-password.tsx:38`).
- `GuestGuard` ignora `returnUrl` y siempre manda a `/dashboard`.
- Sigue activo `disableGuard=true`, un bypass de demo pensado para eliminarse
  (`guest-guard.tsx:24-25`).
- `AuthGuard` solo evalúa al montar: si el token expira o se hace logout en otra
  pestaña, no reacciona.
- Muchos thunks tienen `catch {}` vacío (p. ej. `transactions-slice.ts`,
  `user-slice.ts`) y no muestran error: pantallas vacías sin explicación.

**A14. El splash bloquea todo el sitio**
Con token en `localStorage`, `_app.tsx` no renderiza nada (ni la landing pública)
hasta que `GET /users` responde. Con un backend en Render free (cold start de
30–60 s) o caído, la web queda en blanco.

**A15. Token literal en Redux**
`jwt-context.tsx:130` guarda `token: "accessToken"` (el string) en vez del token
real durante la inicialización.

---

## 5. Funcionalidad incompleta / deuda visible

- `/my-accounts` en desktop renderiza literalmente `<h2>desktop</h2>`
  (`src/pages/my-accounts/index.tsx:21`).
- `/security` no pide contraseña actual para cambiarla; `/reset-password` sí
  (incoherente, ver A4).
- `README.md` es el genérico de `create-next-app`.
- No hay `.env.example`, ni CI, ni tests, ni documentación de la API.
- Dependencias declaradas y **no usadas**: `firebase`, `aws-amplify`,
  `@auth0/auth0-spa-js`, `@fullcalendar/*`, `@react-pdf/renderer`, `draft-js`,
  `react-quill`, `react-draft-wysiwyg`, `react-beautiful-dnd`,
  `react-swipeable-views`, `react-dropzone`, `gray-matter`, `iconv-lite`,
  `numeral`, `simplebar`, `react-markdown`, `react-syntax-highlighter`,
  `@svgr/webpack` (solo para SVG), entre otras.
  Son la causa de la mayoría de las 87 vulnerabilidades y de más de la mitad
  del `node_modules`.
- `next.config.js` transpila `@fullcalendar/*`, que no se usa.
- Analytics GTM con ID hardcodeado (`src/lib/gtm.ts`).
- `useAuth()` devuelve `as any` y descarta el tipo `AuthContextValue`.
- Utilidades JWT de template (`src/utils/jwt.ts`) sin uso.
- Formularios MUI sin labels accesibles: el árbol de accesibilidad del login no
  expone los inputs (verificado con el navegador).
- `console.log` y `console.error` en producción.
- Sin `error.tsx`/error boundary; sin manejo central de 401.
- El formulario de reset envía `submit: null` al backend (campo de Formik).

---

## 6. Plan propuesto

### Fase 0 — Desbloquear el entorno
1. Fijar Node 20 (`.nvmrc`, `engines`, README).
2. Definir la API: recuperar/redeployar el backend o crear uno nuevo.
3. Mover la URL a `NEXT_PUBLIC_API_URL` + `.env.example` + `.env.local`.
4. Crear una `main` desde `develop` y dejar `develop` como integración.

### Fase 1 — Arreglar el login de punta a punta
1. Unificar la fuente de verdad del usuario (Context + Redux en un solo lugar).
2. `register()`: `setUser` en Redux; email correcto en verificación.
3. Post-verificación: refrescar `GET /users` antes de ir a `/dashboard`.
4. Implementar reenvío de email.
5. Conectar `FormResetPassword` (sin contraseña actual) al flujo con token y
   unificar la política de contraseñas con el backend.
6. `logout()`: limpiar Redux; manejo de 401 → logout + redirect.
7. Interceptor: mergear headers, no mandar token en endpoints públicos,
   no confundir `params.token`.
8. Arreglar `err?.reponse` y normalizar errores (`error` vs `message`).
9. Validar `returnUrl` (solo rutas internas).
10. No bloquear la landing con el splash de auth; timeout en `me()`.
11. `firstname` requerido y sin espacio inicial.

### Fase 2 — Base de calidad (skills de Vercel)
Usar `vercel-labs/agent-skills` como guía, en este orden:

| Skill | Uso concreto en este repo |
|---|---|
| `react-best-practices` | Eliminar waterfalls en `AuthProvider`; imports directos; `next/dynamic` para charts/índices; bundle size (quitar deps muertas). |
| `composition-patterns` | Refactor de `AuthGuard`/`GuestGuard`/layouts y de los formularios de auth con props booleanas. |
| `web-design-guidelines` | Accesibilidad de formularios (labels, autocomplete, focus, errores), navegación y estados de carga. |
| `deploy-to-vercel` | Preview deployment + link del repo, una vez que el build sea estable. |
| `vercel-optimize` | Solo cuando esté deployado y con métricas (costos, caching, funciones). |

### Fase 3 — Cierre del producto
- Completar `/my-accounts` desktop.
- Tests de auth (unitarios + e2e con Playwright).
- CI (typecheck + lint + build).
- Actualizar dependencias por olas (primero quitar las no usadas).

---

## 7. Cómo reproducir el entorno

```bash
# Requiere Node 20
npm ci
npm run dev
```

Con el backend caído, el login muestra "Error de servidor". Para trabajar en el
frontend se puede levantar un mock local de la API y apuntar
`NEXT_PUBLIC_API_URL` a él.
