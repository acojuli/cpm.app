import type { FC } from "react";
import {
  Box,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Logo } from "./logo";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";

const links = [
  {
    title: "Índice",
    href: "/indice",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Faqs",
    href: "/faqs",
  },
  {
    title: "Términos",
    href: "/terminos",
  },
  {
    title: "Contacto",
    href: "/contacto",
  },
];

const socialLinks = [
  {
    title: "Instagram",
    href: "https://www.instagram.com/cpm.app/",
    icon: <InstagramIcon fontSize="large" />,
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/crypto-pro-management",
    icon: <LinkedInIcon fontSize="large" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/cpm.app",
    icon: <FacebookIcon fontSize="large" />,
  },
];

export const Footer: FC = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: "background.footer",
      borderTopColor: "divider",
      borderTopStyle: "solid",
      borderTopWidth: 1,
      pb: 2,
      pt: { xs: 6, lg: 6 },
    }}
  >
    <Container maxWidth="xl">
      <Box
        sx={{
          alignItems: { xs: "center", lg: "flex-start" },
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 4, lg: 0 },
          justifyContent: "space-between",
        }}
      >
        {/* Marca */}
        <Box
          sx={{
            maxWidth: 440,
            textAlign: { xs: "center", lg: "left" },
          }}
        >
          <Logo
            variant="light"
            sx={{
              height: { xs: 50, lg: 56 },
              width: { xs: 138, lg: 154 },
            }}
          />
          <Typography
            color="textSecondary"
            sx={{ display: "block", mt: 1 }}
            variant="caption"
          >
            Nos apasiona difundir y brindar herramientas para invertir en
            tecnologías blockchain
          </Typography>
        </Box>

        {/* Menú: vertical centrado en mobile, fila centrada en tablet,
            columna alineada a la derecha en desktop */}
        <Box
          component="nav"
          aria-label="Navegación del pie de página"
          sx={{ width: { xs: "100%", lg: "auto" } }}
        >
          <Box
            component="ul"
            sx={{
              alignItems: { xs: "center", lg: "flex-end" },
              display: "flex",
              flexDirection: { xs: "column", sm: "row", lg: "column" },
              flexWrap: "wrap",
              gap: { xs: 1, sm: 3, lg: 0.5 },
              justifyContent: "center",
              listStyle: "none",
              m: 0,
              p: 0,
            }}
          >
            {links.map((link) => (
              <Box
                component="li"
                key={link.title}
              >
                <Link
                  color="textPrimary"
                  href={link.href}
                  underline="hover"
                  variant="subtitle2"
                >
                  {link.title}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: { lg: "#FFF", xs: "#474444" },
          my: 3,
        }}
      />

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          justifyContent: "space-between",
        }}
      >
        <Typography
          color="textSecondary"
          variant="caption"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          © Cripto Pro Management 2022
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          {socialLinks.map((social) => (
            <Link
              aria-label={social.title}
              color="inherit"
              href={social.href}
              key={social.title}
              rel="noreferrer"
              target="_blank"
            >
              {social.icon}
            </Link>
          ))}
        </Stack>
      </Box>
    </Container>
  </Box>
);
