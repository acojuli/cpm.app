import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { Logo } from '../components/logo';
import { useAuth } from '../hooks/use-auth';
import { JWTRegister } from '../components/authentication/jwt-register';
import { GuestGuard } from 'src/components/authentication/guest-guard';

type Platform = 'Amplify' | 'Auth0' | 'Firebase' | 'JWT';


const Register: NextPage = () => {
  const router = useRouter();
  const { platform }: { platform: Platform } = useAuth();
  const returnUrl = router.query.returnUrl as string | undefined;

  return (
    <>
      <Head>
        <title>Crear cuenta | CPM</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '25px',
            }
          }}
        >
          <Card
            elevation={0}
            sx={{ 
                backgroundColor:'background.default',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                p: { sm: 5, xs: 3 }
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                        height: 60,
                        width: 100
                    }}
                  />
                </a>
              </NextLink>
              <Typography
                component="h1"
                sx={{ fontSize: 24, fontWeight: 700, mt: 1 }}
              >
                Te damos la bienvenida
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ fontSize: 15, mt: 1 }}
              >
                Creá tu cuenta para empezar a invertir
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              {platform === 'JWT' && <JWTRegister />}
            </Box>
            <div style={{
                marginTop: 15,
                textAlign:'center'
                }}
            >
            ¿Ya tenés cuenta? {' '}
              <NextLink
                href={{
                  pathname: '/login',
                  query: returnUrl ? { returnUrl } : undefined
                }}
                passHref
              >
                <Link
                  color="primary"
                  variant="body2"
                >
                  Iniciá sesión
                </Link>
              </NextLink>
            </div>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Register.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default Register;
