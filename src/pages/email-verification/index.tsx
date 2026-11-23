import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Alert, Link } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { useAuth } from 'src/hooks/use-auth';
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
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.default', p: 0 }}>
      <Box sx={{ width: '100%', textAlign: 'center', color: 'common.white', p: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
        >
          Verifica tu email
        </Typography>
        <Typography>Te enviamos un email a:</Typography>
        <Typography fontWeight="fontWeightBold">
          {userEmail || 'tu correo registrado'}
        </Typography>
        <Typography gutterBottom>
          Revisa tu correo y haz click en el enlace que te enviamos
        </Typography>

        {mockToken && (
          <Alert severity="info" sx={{ mt: 2, textAlign: 'left', color: 'text.primary' }}>
            <Typography variant="body2" fontWeight="fontWeightBold">
              Modo mock: no se envían emails reales.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
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
            severity={feedback.type}
            sx={{ mt: 2, textAlign: 'left' }}
            onClose={() => setFeedback(null)}
          >
            {feedback.text}
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleResendEmail}
          disabled={sending}
          sx={{
            mt: 2,
            bgcolor: 'secondary.main',
            '&:hover': {
              bgcolor: 'secondary.dark',
            },
          }}
        >
          {sending ? 'Enviando...' : 'Reenviar email'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCheckVerification}
          disabled={checking}
          sx={{ mt: 2, ml: { sm: 1 }, color: 'common.white', borderColor: 'common.white' }}
        >
          {checking ? 'Comprobando...' : 'Ya verifiqué mi email'}
        </Button>
        <Button
          onClick={handleReturnHome}
          sx={{
            mt: 2,
            color: 'common.white',
            display: 'block',
            width: '100%',
          }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default EmailVerificationPage;
