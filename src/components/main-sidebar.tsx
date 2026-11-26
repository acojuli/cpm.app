import { useEffect } from "react";
import type { FC } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Link,
  Stack,
} from "@mui/material";
import type { Theme } from "@mui/material";
import { styled, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Logo } from "./logo";

interface MainSidebarProps {
  onClose?: () => void;
  open?: boolean;
}

const navigation = [
  { title: "Índice", href: "/indice" },
  { title: "Blog", href: "/blog" },
  { title: "FAQs", href: "/faqs" },
  { title: "Términos", href: "/terminos" },
  { title: "Contacto", href: "/contacto" },
];

const MainSidebarLink = styled(Link)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: "block",
  padding: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const MainSidebar: FC<MainSidebarProps> = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const handlePathChange = () => {
    if (open) {
      onClose?.();
    }
  };

  const handleClose = () => {
    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={!mdUp && open}
      ModalProps={{
        "aria-label": "Menú de navegación",
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          backgroundColor: "background.default",
          border: 0,
          borderLeft: { sm: "1px solid rgba(245, 250, 255, 0.15)" },
          borderRadius: 0,
          width: { xs: "100%", sm: 400 },
        },
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar + 100,
      }}
      variant="temporary"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 2,
        }}
      >
        {/* Header del panel */}
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <NextLink
            href="/"
            passHref
          >
            <a aria-label="Ir al inicio">
              <Logo
                sx={{
                  height: 48,
                  width: 96,
                }}
              />
            </a>
          </NextLink>
          <IconButton
            aria-label="Cerrar menú"
            color="primary"
            onClick={handleClose}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Navegación */}
        <Box
          component="nav"
          aria-label="Navegación principal"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            mt: 3,
          }}
        >
          {navigation.map((item) => {
            const isActive = router.pathname === item.href;

            return (
              <NextLink
                href={item.href}
                key={item.href}
                passHref
              >
                <MainSidebarLink
                  color="textPrimary"
                  onClick={handleClose}
                  sx={
                    isActive
                      ? {
                          backgroundColor: "rgba(0, 255, 51, 0.08)",
                          color: "primary.main",
                        }
                      : undefined
                  }
                  underline="none"
                  variant="subtitle2"
                >
                  {item.title}
                </MainSidebarLink>
              </NextLink>
            );
          })}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Acciones */}
        <Stack
          spacing={1.5}
          sx={{ pb: 1, pt: 3 }}
        >
          <Button
            component="a"
            fullWidth
            href="/register"
            size="large"
            variant="contained"
          >
            Registrate
          </Button>
          <Button
            component="a"
            fullWidth
            href="/login"
            size="large"
            variant="outlined"
          >
            Inicia sesión
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

MainSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
