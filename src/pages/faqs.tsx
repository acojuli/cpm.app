import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import type { NextPage } from "next";
import Head from "next/head";
import { AccordionComponent } from "../components/faqs/index";
import { MainNavbar } from "../components/main-navbar";
import { useState } from "react";
import { MainSidebar } from "src/components/main-sidebar";
import Link from "next/link";
import GoBack from "src/components/widgets/goBack";
import { Footer } from "src/components/footer";

const Faqs: NextPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleOpenSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <Head>
        <title>CPM | Preguntas frecuentes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 10,
          pt: 10,
        }}
      >
        <Container maxWidth="md">
          <MainNavbar onOpenSidebar={handleOpenSideBar} />
          <MainSidebar
            onClose={(): void => setIsSidebarOpen(false)}
            open={isSidebarOpen}
          />
          <Box sx={{ mb: { md: 6, xs: 4 }, mt: { md: 4, xs: 1 } }}>
            <Typography
              color="primary"
              variant="overline"
            >
              Ayuda
            </Typography>
            <Typography
              component="h1"
              sx={{
                alignItems: "center",
                display: "flex",
                fontSize: { md: 44, xs: 30 },
                fontWeight: 700,
                lineHeight: 1.15,
                mb: 2,
                mt: 0.5,
              }}
            >
              <GoBack />
              Preguntas frecuentes
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ fontSize: 17, lineHeight: 1.7 }}
            >
              Consultá las dudas más frecuentes de nuestros usuarios. Si no
              encontrás lo que estás buscando,{" "}
              <Link
                href="/contacto"
                passHref
              >
                <a style={{ color: "#0f3", textDecoration: "underline" }}>
                  contactanos
                </a>
              </Link>
              .
            </Typography>
          </Box>
          <AccordionComponent />
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Faqs;
