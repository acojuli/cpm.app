import { useEffect, useState } from 'react';
import { Alert, Button, Link, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { useAuth } from 'src/hooks/use-auth';
import { AuthShell } from 'src/components/authentication/auth-shell';
import { authApi, toApiError } from 'src/services/api-auth';
import { getSafeReturnUrl } from 'src/utils/safe-return-url';
import { MOCK_VERIFICATION_TOKEN_KEY } from 'src/services/api-config';

const EmailVerificationPage = () => {
  const { isInitialized, isAuthenticated, user: authUser, refreshUser } = useAuth();
  const reduxUser = useSelector((state: RootState) => state.user.userData.user);

  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  // Solo dev: el mock devuelve el token para poder verificar sin email.
  const [mockToken, setMockToken] = useState<string>('');

  const userEmail = reduxUser?.email || authUser?.user?.email || '';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setMockToken(window.sessionStorage.getItem(MOCK_VERIFICATION_TOKEN_KEY) || '');
  }, []);

  useEffect(() => {
    if (router.isReady && isInitialized && !isAuthenticated) {
      router.replace('/login').catch(console.error);
    }
  }, [router, isInitialized, isAuthenticated]);

  const saveMockToken = (token?: string) => {
    if (!token || typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(MOCK_VERIFICATION_TOKEN_KEY, token);
    setMockToken(token);
  };

  const handleResendEmail = async () => {
    setSending(true);
    setFeedback(null);

    try {
      const response = await authApi.resendVerification();
      saveMockToken(response.mock_verification_token);
      setFeedback({
        type: 'success',
        text: 'Te enviamos un nuevo email de verificación. Revisá tu bandeja de entrada y spam.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        text: toApiError(error, 'No se pudo reenviar el email').message,
      });
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    setFeedback(null);

    try {
      const user = await refreshUser();

      if (user?.active) {
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(MOCK_VERIFICATION_TOKEN_KEY);
        }
        router
          .replace(getSafeReturnUrl(router.query.returnUrl))
          .catch(console.error);
      } else {
        setFeedback({
          type: 'error',
          text: 'Todavía no verificaste tu email. Revisá tu correo y volvé a intentar.',
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: toApiError(error, 'No se pudo comprobar la verificación').message,
      });
    } finally {
      setChecking(false);
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <AuthShell
      description={
        <>
          Te enviamos un email a{' '}
          <Typography
            color="textPrimary"
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {userEmail || 'tu correo registrado'}
          </Typography>
          . Revisá tu bandeja de entrada (y el spam) y hacé clic en el enlace
          que te enviamos.
        </>
      }
      title="Verificá tu email"
    >
      {mockToken && (
        <Alert
          severity="info"
          sx={{ mb: 2, textAlign: 'left' }}
        >
          <Typography
            fontWeight="fontWeightBold"
            variant="body2"
          >
            Modo mock: no se envían emails reales.
          </Typography>
          <Typography
            sx={{ mb: 1 }}
            variant="body2"
          >
            Usá este enlace para verificar la cuenta:
          </Typography>
          <Link
            href={`/verify-email?token=${encodeURIComponent(mockToken)}`}
            underline="always"
          >
            Verificar mi email ahora
          </Link>
        </Alert>
      )}

      {feedback && (
        <Alert
          onClose={() => setFeedback(null)}
          severity={feedback.type}
          sx={{ mb: 2, textAlign: 'left' }}
        >
          {feedback.text}
        </Alert>
      )}

      <Stack spacing={1.5}>
        <Button
          disabled={checking}
          fullWidth
          onClick={handleCheckVerification}
          size="large"
          variant="contained"
        >
          {checking ? 'Comprobando...' : 'Ya verifiqué mi email'}
        </Button>
        <Button
          disabled={sending}
          fullWidth
          onClick={handleResendEmail}
          size="large"
          variant="outlined"
        >
          {sending ? 'Enviando...' : 'Reenviar email'}
        </Button>
        <Button
          color="inherit"
          fullWidth
          onClick={handleReturnHome}
        >
          Volver al inicio
        </Button>
      </Stack>
    </AuthShell>
  );
};

export default EmailVerificationPage;
