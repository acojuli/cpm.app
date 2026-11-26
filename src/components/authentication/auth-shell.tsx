import type { ReactNode } from "react";
import NextLink from "next/link";
import { Box, Card, Container, Typography } from "@mui/material";
import { Logo } from "../logo";

interface Props {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}

export const AuthShell = ({ title, description, children }: Props) => (
  <Box
    component="main"
    sx={{
      backgroundColor: "background.paper",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100vh",
    }}
  >
    <Container
      maxWidth="sm"
      sx={{ py: "25px" }}
    >
      <Card
        elevation={0}
        sx={{
          backgroundColor: "background.default",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          p: { sm: 5, xs: 3 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
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
          <Typography
            component="h1"
            sx={{ fontSize: 24, fontWeight: 700, mt: 1 }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              color="textSecondary"
              component="div"
              sx={{ fontSize: 15, lineHeight: 1.7, mt: 1 }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {children && <Box sx={{ mt: 3 }}>{children}</Box>}
      </Card>
    </Container>
  </Box>
);
