import { useEffect, useState } from "react";
import type { FC, ReactNode } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import type { Theme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Logo } from "../logo";
import { useDispatch, useSelector } from "../../store/index";
import { openLogoutModal } from "src/slices/logout-modal-slice";

interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
}

const siteLinks: NavItem[] = [
  { title: "Índices", href: "/indice" },
  { title: "Blog", href: "/blog" },
  { title: "FAQs", href: "/faqs" },
  { title: "Términos", href: "/terminos" },
  { title: "Contacto", href: "/contacto" },
];

const accountLinks: NavItem[] = [
  { title: "Portfolio", href: "/dashboard", icon: <BarChartIcon fontSize="small" /> },
  {
    title: "Mis datos",
    href: "/my-data",
    icon: <AccountCircleIcon fontSize="small" />,
  },
  {
    title: "Mis cuentas",
    href: "/my-accounts",
    icon: <AccountBalanceIcon fontSize="small" />,
  },
  {
    title: "Seguridad",
    href: "/security",
    icon: <LockOutlinedIcon fontSize="small" />,
  },
];

const getInitials = (name?: string): string => {
  if (!name) {
    return "CP";
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

export const LoggedNavbar: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { user } = userData;
  const [open, setOpen] = useState<boolean>(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  useEffect(() => {
    setOpen(false);
  }, [router.asPath]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    setOpen(false);
    dispatch(openLogoutModal());
  };

  const isActive = (href: string) => router.pathname === href;

  return (
    <>
      <AppBar
        elevation={0}
        sx={{
          backgroundColor: "background.default",
          border: 0,
          borderRadius: 0,
          color: "text.primary",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ gap: 1, minHeight: 64 }}
          >
            <NextLink
              href="/dashboard"
              passHref
            >
              <a aria-label="Ir al portfolio">
                <Logo
                  sx={{
                    height: 60,
                    width: 100,
                  }}
                />
              </a>
            </NextLink>

            <Box sx={{ flexGrow: 1 }} />

            <Box
              component="nav"
              aria-label="Navegación del sitio"
              sx={{
                alignItems: "center",
                display: { xs: "none", lg: "flex" },
                gap: 2.5,
              }}
            >
              {siteLinks.map((item) => (
                <NextLink
                  href={item.href}
                  key={item.href}
                  passHref
                >
                  <Link
                    color="textSecondary"
                    underline="hover"
                    variant="subtitle2"
                  >
                    {item.title}
                  </Link>
                </NextLink>
              ))}
            </Box>

            <Button
              aria-label="Abrir menú de usuario"
              onClick={handleOpen}
              sx={{
                borderRadius: "50%",
                minWidth: 0,
                ml: { xs: 0, lg: 1.5 },
                p: 0.5,
              }}
            >
              <Avatar
                alt={user?.full_name}
                src={user?.avatar}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: 13,
                  fontWeight: 700,
                  height: 36,
                  width: 36,
                }}
              >
                {getInitials(user?.full_name)}
              </Avatar>
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        onClose={handleClose}
        open={open}
        ModalProps={{
          "aria-label": "Menú de usuario",
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
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              color="textSecondary"
              variant="overline"
            >
              Mi cuenta
            </Typography>
            <IconButton
              aria-label="Cerrar menú"
              color="primary"
              onClick={handleClose}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              gap: 2,
              mt: 1,
            }}
          >
            <Avatar
              alt={user?.full_name}
              src={user?.avatar}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: 18,
                fontWeight: 700,
                height: 56,
                width: 56,
              }}
            >
              {getInitials(user?.full_name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                variant="h6"
              >
                {user?.full_name || "Mi cuenta"}
              </Typography>
              <Typography
                color="textSecondary"
                noWrap
                variant="body2"
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            component="nav"
            aria-label="Navegación de la cuenta"
          >
            <Stack spacing={0.5}>
              {accountLinks.map((item) => (
                <NextLink
                  href={item.href}
                  key={item.href}
                  passHref
                >
                  <Button
                    color={isActive(item.href) ? "primary" : "inherit"}
                    component="a"
                    href={item.href}
                    onClick={handleClose}
                    startIcon={item.icon}
                    sx={{
                      backgroundColor: isActive(item.href)
                        ? "rgba(0, 255, 51, 0.08)"
                        : "transparent",
                      justifyContent: "flex-start",
                      px: 1.5,
                      py: 1,
                      textTransform: "none",
                    }}
                    variant="text"
                  >
                    {item.title}
                  </Button>
                </NextLink>
              ))}
            </Stack>
          </Box>

          <Box
            component="nav"
            aria-label="Navegación del sitio"
            sx={{
              display: { xs: "block", lg: "none" },
              mt: 2,
            }}
          >
            <Typography
              color="textSecondary"
              sx={{ mb: 0.5, px: 1.5 }}
              variant="overline"
            >
              Sitio
            </Typography>
            <Stack spacing={0.5}>
              {siteLinks.map((item) => (
                <NextLink
                  href={item.href}
                  key={item.href}
                  passHref
                >
                  <Button
                    color="inherit"
                    component="a"
                    href={item.href}
                    onClick={handleClose}
                    sx={{
                      justifyContent: "flex-start",
                      px: 1.5,
                      py: 1,
                      textTransform: "none",
                    }}
                    variant="text"
                  >
                    {item.title}
                  </Button>
                </NextLink>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            fullWidth
            onClick={handleLogout}
            size="large"
            startIcon={<LogoutIcon />}
            sx={{ justifyContent: "center" }}
            variant="outlined"
          >
            Cerrar sesión
          </Button>
        </Box>
      </Drawer>
    </>
  );
};
