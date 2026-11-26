import type { ReactNode } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Logo } from "../logo";

interface Props {
  code: string;
  title: string;
  description: string;
  primaryAction: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  icon?: ReactNode;
}

export const ErrorPage = ({
  code,
  title,
  description,
  primaryAction,
  secondaryAction,
}: Props) => (
  <>
    <Head>
      <title>{`${code} | CPM`}</title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: "center",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        minHeight: "100vh",
        px: 2,
        py: 6,
      }}
    >
      <NextLink
        href="/"
        passHref
      >
        <a aria-label="Ir al inicio">
          <Logo sx={{ height: 60, width: 100 }} />
        </a>
      </NextLink>

      <Container
        maxWidth="sm"
        sx={{ textAlign: "center" }}
      >
        <Typography
          aria-hidden
          sx={{
            color: "primary.main",
            fontSize: { sm: 120, xs: 84 },
            fontWeight: 800,
            letterSpacing: 2,
            lineHeight: 1,
            mt: 6,
          }}
        >
          {code}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { sm: 32, xs: 24 },
            fontWeight: 700,
            mt: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          color="textSecondary"
          sx={{ fontSize: 16, lineHeight: 1.7, mt: 1.5 }}
        >
          {description}
        </Typography>

        <Stack
          direction={{ sm: "row", xs: "column" }}
          justifyContent="center"
          spacing={1.5}
          sx={{ mt: 5 }}
        >
          <NextLink
            href={primaryAction.href}
            passHref
          >
            <Button
              component="a"
              size="large"
              variant="contained"
            >
              {primaryAction.label}
            </Button>
          </NextLink>
          {secondaryAction && (
            <NextLink
              href={secondaryAction.href}
              passHref
            >
              <Button
                component="a"
                size="large"
                variant="outlined"
              >
                {secondaryAction.label}
              </Button>
            </NextLink>
          )}
        </Stack>
      </Container>
    </Box>
  </>
);
