import type { FC } from "react";
import NextLink from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export const HomeHero: FC = () => {
  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 6 },
      }}
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
          <Box sx={{ flex: 1, width: "100%", maxWidth: { md: 540 } }}>
            <Typography
              align="left"
              variant="h1"
              sx={{
                fontSize: { xs: "2.6rem", sm: "3.25rem", md: "4.375rem" },
                letterSpacing: { xs: "2px", md: "4px" },
                lineHeight: 1.12,
              }}
            >
              Fondos cripto
              <br />
              indexados
            </Typography>

            <Stack
              spacing={0.5}
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              <Typography
                align="left"
                variant="subtitle1"
              >
                Estrategia automatizada
              </Typography>
              <Typography
                align="left"
                variant="subtitle1"
              >
                Exposición diversificada
              </Typography>
            </Stack>

            <NextLink
              href="/dashboard"
              passHref
            >
              <Button
                component="a"
                size="large"
                variant="contained"
                sx={{ mt: { xs: 3, md: 5 }, px: { xs: 4, md: 6 } }}
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
              src="/images/home-heroimg.svg"
              alt="Ilustración de fondos cripto indexados"
              sx={{
                display: "block",
                height: "auto",
                maxWidth: { xs: 380, sm: 460, md: 620 },
                width: "100%",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
