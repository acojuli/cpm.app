import { useEffect, useState } from "react";
import { Box, ButtonBase, Chip, Link, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import NextLink from "next/link";
import { UnloggedLayout } from "src/components/common/unlogged-layout";
import { useSelector } from "src/store";
import { BackwardButton } from "src/components/common";

interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  highlight?: { after: number; text: string };
}

const sections: Section[] = [
  {
    id: "generales",
    title: "Aspectos generales",
    paragraphs: [
      "Estos TyC regularán la navegación dentro del sitio web cpm.la (en adelante, \"EL SITIO\" o \"LA PLATAFORMA\") y sus subdominios. Los productos o servicios que se adquieran a través de LA PLATAFORMA se regirán por contratos especiales.",
      "En caso de no encontrarse de acuerdo con los presentes TyC, solicitamos se abstenga de utilizar los servicios ofrecidos en LA PLATAFORMA.",
    ],
    highlight: {
      after: 0,
      text: "AL HACER CLIC EN \"ACEPTO\", ACCEDER O UTILIZAR NUESTROS SERVICIOS (COMO SE DEFINE EN ESTOS TyC), USTED ACEPTA ESTOS TyC EN SU TOTALIDAD, Y OTROS TÉRMINOS INCORPORADOS POR REFERENCIA.",
    },
  },
  {
    id: "modificacion",
    title: "Modificación de los TyC",
    paragraphs: [
      "Los presentes Términos y Condiciones podrán ser sustituidos o sufrir modificaciones en cualquier momento a exclusivo criterio de LA EMPRESA, sin necesidad de consentimiento de los Usuarios. Para las transacciones en curso que hayan comenzado con anterioridad a la implementación de dichas modificaciones, subsistirán las condiciones vigentes al momento de su concertación, a menos que las modificaciones introducidas resulten más convenientes para el Usuario.",
      "Como única y válida notificación, LA EMPRESA enviará un correo electrónico al Usuario y/o notificará a través de LA PLATAFORMA sobre estos cambios, durante un tiempo razonable. Sin perjuicio de lo anterior, los Usuarios son responsables de leer estos TyC cada vez que ingresen a LA PLATAFORMA a fin de verificar la vigencia de los mismos y/o si se han producido modificaciones.",
    ],
  },
];

const Terminos: NextPage = () => {
  const { isMobile } = useSelector((state) => state.mobile);
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  };

  return (
    <Box sx={{ mx: "auto", maxWidth: 1100, pb: 4, pt: { md: 4, xs: 1 } }}>
      <Box sx={{ maxWidth: 760, mb: { md: 6, xs: 4 } }}>
        {isMobile && <BackwardButton />}
        <Typography
          color="primary"
          variant="overline"
        >
          Legal
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { md: 44, xs: 30 },
            fontWeight: 700,
            lineHeight: 1.15,
            mb: 2,
            mt: 0.5,
          }}
        >
          Términos y condiciones
        </Typography>
        <Chip
          label="Última actualización: 07/12/2022"
          size="small"
          sx={{
            backgroundColor: "background.paper",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        />
      </Box>

      <Box
        sx={{
          alignItems: "flex-start",
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          gap: { md: 6, xs: 3 },
        }}
      >
        <Box
          component="nav"
          aria-label="Secciones de los términos"
          sx={{
            alignSelf: { md: "flex-start", xs: "stretch" },
            flexShrink: 0,
            position: { md: "sticky", xs: "static" },
            top: { md: 88 },
            width: { md: 260, xs: "100%" },
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 2,
              p: 1,
            }}
          >
            <Typography
              color="textSecondary"
              sx={{ display: { md: "block", xs: "none" }, px: 1.5, py: 1 }}
              variant="overline"
            >
              En esta página
            </Typography>
            <Stack
              direction={{ md: "column", xs: "row" }}
              flexWrap={{ md: "nowrap", xs: "wrap" }}
              spacing={0.5}
              sx={{ gap: { xs: 0.5 }, overflowX: "hidden" }}
            >
              {sections.map((section, index) => {
                const active = activeId === section.id;

                return (
                  <ButtonBase
                    component="a"
                    href={`#${section.id}`}
                    key={section.id}
                    onClick={goTo(section.id)}
                    sx={{
                      backgroundColor: active
                        ? "rgba(0, 255, 51, 0.08)"
                        : "transparent",
                      borderRadius: 1,
                      color: active ? "primary.main" : "text.primary",
                      fontSize: 14,
                      fontWeight: 600,
                      gap: 1.5,
                      justifyContent: "flex-start",
                      px: 1.5,
                      py: 1.25,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ opacity: 0.6 }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Box>
                    {section.title}
                  </ButtonBase>
                );
              })}
            </Stack>
          </Box>
        </Box>

        <Box sx={{ flex: 1, maxWidth: 760, minWidth: 0 }}>
          <Stack spacing={{ md: 6, xs: 4 }}>
            {sections.map((section, index) => (
              <Box
                component="section"
                id={section.id}
                key={section.id}
                sx={{ scrollMarginTop: 88 }}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1.5}
                  sx={{ mb: 2 }}
                >
                  <Typography
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Typography>
                  <Typography
                    component="h2"
                    sx={{ fontSize: { md: 28, xs: 22 }, fontWeight: 700 }}
                  >
                    {section.title}
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <Box key={paragraph.slice(0, 24)}>
                      <Typography
                        color="textSecondary"
                        sx={{ fontSize: 16, lineHeight: 1.8 }}
                      >
                        {paragraph}
                      </Typography>
                      {section.highlight?.after === paragraphIndex && (
                        <Box
                          sx={{
                            backgroundColor: "background.paper",
                            borderLeft: "3px solid",
                            borderColor: "primary.main",
                            borderRadius: 1,
                            mt: 2,
                            px: 2.5,
                            py: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
                              letterSpacing: 0.2,
                              lineHeight: 1.7,
                            }}
                          >
                            {section.highlight.text}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Box
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 2,
              mt: 6,
              p: 3,
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
              ¿Tenés dudas sobre estos términos?
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ fontSize: 15, lineHeight: 1.7 }}
            >
              Escribinos desde la página de{" "}
              <NextLink
                href="/contacto"
                passHref
              >
                <Link underline="always">contacto</Link>
              </NextLink>{" "}
              y te respondemos a la brevedad.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
Terminos.getLayout = (page) => (
  <UnloggedLayout head="Términos y Condiciones | CPM">{page}</UnloggedLayout>
);

export default Terminos;
