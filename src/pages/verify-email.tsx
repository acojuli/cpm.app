import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { AuthShell } from 'src/components/authentication/auth-shell';
import { authApi, toApiError } from 'src/services/api-auth';
import { getSafeReturnUrl } from 'src/utils/safe-return-url';
import { MOCK_VERIFICATION_TOKEN_KEY } from 'src/services/api-config';

type VerificationStatus = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const { isInitialized, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState<string>('Verificando tu email...');

  useEffect(() => {
    if (!router.isReady || !isInitialized) {
      return undefined;
    }

    const token = router.query.token;

    if (typeof token !== 'string' || !token) {
      setStatus('error');
      setMessage('Token no proporcionado o inválido.');
      return undefined;
    }

    let cancelled = false;

    const verifyEmail = async (verificationToken: string) => {
      try {
        const data = await authApi.verifyEmail(verificationToken);

        if (cancelled) {
          return;
        }

        if (!data.active) {
          setStatus('error');
          setMessage(
            data.message ||
              'Error en la verificación. El token puede ser inválido o haber expirado.'
          );
          return;
        }

        setStatus('success');
        setMessage('¡Email verificado correctamente!');

        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(MOCK_VERIFICATION_TOKEN_KEY);
        }

        if (isAuthenticated) {
          try {
            await refreshUser();
          } catch (refreshError) {
            // La verificación ya fue exitosa; si falla el refresco, el guard
            // volverá a consultar el usuario al navegar.
          }

          if (!cancelled) {
            const returnUrl = getSafeReturnUrl(router.query.returnUrl);
            router.replace(returnUrl).catch(console.error);
          }
        } else {
          router
            .replace({ pathname: '/login', query: { verified: '1' } })
            .catch(console.error);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus('error');
        setMessage(
          toApiError(
            error,
            'Error al verificar el correo electrónico. Intenta de nuevo más tarde.'
          ).message
        );
      }
    };

    verifyEmail(token);

    return () => {
      cancelled = true;
    };
    // `refreshUser` es estable (useCallback).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    router.query.token,
    router.query.returnUrl,
    isInitialized,
    isAuthenticated,
  ]);

  return (
    <AuthShell
      description={
        status === 'error' ? (
          <Typography
            color="error"
            component="span"
          >
            {message}
          </Typography>
        ) : (
          message
        )
      }
      title="Verificación de email"
    >
      {status === 'loading' && <CircularProgress />}

      {status === 'error' && (
        <Button
          fullWidth
          onClick={() => router.push('/login')}
          size="large"
          variant="contained"
        >
          Volver a iniciar sesión
        </Button>
      )}
    </AuthShell>
  );
}
