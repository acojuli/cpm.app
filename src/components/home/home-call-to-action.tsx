import type { FC } from "react";
import { Box } from "@mui/system";
import { Button, Container, Typography } from "@mui/material";
import NextLink from "next/link";

export const HomeCallToAction: FC = () => {
  return (
    <Box
      component="section"
      sx={{ pt: { xs: 6, md: 10 } }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
              width: "100%",
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "1.7rem", sm: "2rem" } }}
            >
              Registrate e invertí
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "1.7rem", sm: "2rem" }, mb: 3 }}
            >
              en la industria cripto
            </Typography>
            <NextLink
              href="/register"
              passHref
            >
              <Button
                component="a"
                size="large"
                variant="contained"
                sx={{ px: { xs: 4, md: 6 } }}
              >
                Invertir
              </Button>
            </NextLink>
          </Box>

          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src="/images/home-cta.svg"
              alt="Personas invirtiendo en cripto"
              sx={{
                display: "block",
                height: "auto",
                maxWidth: 560,
                width: "100%",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
