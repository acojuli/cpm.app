import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Typography, Link } from "@mui/material";
import NextLink from 'next/link';
import Head from "next/head";
import { MainNavbar } from "src/components/main-navbar";
import { MainSidebar } from "src/components/main-sidebar";
import { Composition } from "./composition";
import { Terms } from "./terms";
import Performance from "../performance";
import { Documents } from "./documents";
import { Footer } from "src/components/footer";
import apiClientWithoutToken from "src/services/api-client-without-token";
import { Ticket } from "../types";

export const DesktopIndices = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [compositionData, setCompositionData] = useState<Ticket[]>([]);
  const [isCompositionLoading, setIsCompositionLoading] = useState(true);

  const handleOpenSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClientWithoutToken.get("/funds");
        setCompositionData(result.data?.[0]?.tickets || []);
      } catch (error) {
        console.log("ERROR=>", error);
        setCompositionData([]);
      } finally {
        setIsCompositionLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>CPM | Indices</title>
      </Head>

      <Box component="main" sx={{ pb: 8, pt: 10 }}>
        <Container maxWidth="lg">
          <MainNavbar onOpenSidebar={handleOpenSideBar} />
          <MainSidebar
            onClose={(): void => setIsSidebarOpen(false)}
            open={isSidebarOpen}
          />

          <Box sx={{ mx: "auto", maxWidth: 760, textAlign: "center" }}>
            <Typography
              mb={2}
              variant="h1"
            >
              Índice Foundation
            </Typography>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              Fondo de inversión en proyectos de plataformas de contratos
              inteligentes seleccionados de manera diversificada.
            </Typography>
            <Button
              component="a"
              href="/login"
              sx={{ mb: 8, mt: 4, minWidth: 200 }}
              variant="contained"
            >
              Invertir
            </Button>
          </Box>

          <Typography
            color="textSecondary"
            mb={1}
            variant="body2"
          >
            La novedad del mercado cripto presenta desafíos a la hora de evaluar
            y elegir proyectos particulares para invertir.
          </Typography>

          <Typography
            color="textSecondary"
            mb={8}
            variant="body2"
          >
            A través de los fondos, que replican los índices CPM, se facilita a
            los inversores el proceso de decisión de inversión.
          </Typography>

          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <Composition
                composition={compositionData}
                loading={isCompositionLoading}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Terms />
            </Grid>
          </Grid>

          <Box mt={8}>
            <Typography
              mb={3}
              variant="h3"
            >
              Rendimiento
            </Typography>
            <Performance
              height={320}
              showRanges
            />
          </Box>

          <Box mt={8}>
            <Typography
              mb={2}
              variant="h3"
            >
              Objetivo y estrategia
            </Typography>
            <Typography
              color="textSecondary"
              mb={1}
              variant="body2"
            >
              Capitalizar el crecimiento de la industria y la adopción masiva de
              la tecnología blockchain invirtiendo de manera temprana en
              proyectos con potencial de servir como infraestructura para la
              era del internet del dinero.
            </Typography>

            <Typography
              color="textSecondary"
              variant="body2"
            >
              Para ver las metodologías aplicadas en el índice Foundation,{" "}
              <NextLink href={"/static/documents/metodologia-indice-foundation.pdf"} passHref>
                <Link underline="always">hacé click aquí.</Link>
              </NextLink>
            </Typography>
          </Box>

          <Box mt={8}>
            <Documents />
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
