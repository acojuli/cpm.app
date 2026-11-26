import type { NextPage } from "next";
import { MainNavbar } from "src/components/main-navbar";
import { MainSidebar } from "src/components/main-sidebar";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Footer } from "src/components/footer";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import apiClientWithoutToken from "src/services/api-client-without-token";
import GoBack from "src/components/widgets/goBack";

const Contacto: NextPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleOpenSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Debes completar este campo"),
    email: Yup.string()
      .email("Debes ingresar un email válido")
      .required("El email es requerido"),
    message: Yup.string().required("Tu mensaje no puede estar vacío"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, helpers) => {
      setStatus("idle");

      try {
        const response = await apiClientWithoutToken.post(
          "/contactForm",
          JSON.stringify(values, null, 2)
        );

        if (response.status === 201) {
          helpers.resetForm();
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.log("ERROR=>", error);
        setStatus("error");
      }
    },
  });

  return (
    <>
      <Head>
        <title>CPM | Contacto</title>
      </Head>
      <MainNavbar onOpenSidebar={handleOpenSideBar} />
      <MainSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 10,
          pt: 12,
        }}
      >
        <Container maxWidth="lg">
          <Grid
            alignItems="center"
            container
            spacing={{ md: 8, xs: 4 }}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <Typography
                color="primary"
                variant="overline"
              >
                Contacto
              </Typography>
              <Typography
                component="h1"
                sx={{
                  alignItems: "center",
                  display: "flex",
                  fontSize: { md: 44, xs: 30 },
                  fontWeight: 700,
                  lineHeight: 1.15,
                  mb: 1.5,
                  mt: 0.5,
                }}
              >
                <GoBack />
                Hablemos
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ fontSize: 17, lineHeight: 1.7, mb: 4 }}
              >
                ¿Cómo podemos ayudarte? Dejanos tu consulta y te respondemos a
                la brevedad.
              </Typography>

              {status === "success" && (
                <Alert
                  onClose={() => setStatus("idle")}
                  severity="success"
                  sx={{
                    backgroundColor: "rgba(0, 255, 51, 0.12)",
                    border: "1px solid #00FF33",
                    mb: 2,
                  }}
                >
                  ¡Gracias por escribirnos! Te responderemos muy pronto.
                </Alert>
              )}
              {status === "error" && (
                <Alert
                  onClose={() => setStatus("idle")}
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  Algo salió mal. Por favor intentá de nuevo más tarde.
                </Alert>
              )}

              <Box
                component="form"
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <TextField
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  id="name"
                  label="Nombre"
                  margin="normal"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Juan Pérez"
                  value={formik.values.name}
                />
                <TextField
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  id="email"
                  label="Email"
                  margin="normal"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="ejemplo@mail.com"
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={
                    formik.touched.message && Boolean(formik.errors.message)
                  }
                  fullWidth
                  helperText={formik.touched.message && formik.errors.message}
                  id="message"
                  label="Mensaje"
                  margin="normal"
                  multiline
                  name="message"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Contanos en qué podemos ayudarte"
                  rows={6}
                  value={formik.values.message}
                />
                <Button
                  disabled={formik.isSubmitting}
                  size="large"
                  sx={{ minWidth: { md: 220, xs: "100%" }, mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  {formik.isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              md={6}
              sx={{ display: { md: "block", xs: "none" } }}
              xs={12}
            >
              <Box
                alt=""
                component="img"
                src="/static/home/contact.svg"
                sx={{
                  display: "block",
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Contacto;
