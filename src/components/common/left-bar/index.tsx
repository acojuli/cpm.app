import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { useRouter } from "next/router";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "src/store";
import { NavigationItem as NavigationItemType } from "src/types/left-bar";
import { openLogoutModal } from "src/slices/logout-modal-slice";
import { NavigationItem } from "./navigation-item";

interface Props {
  navigationList?: NavigationItemType[];
  showUser?: boolean;
  showIcons?: boolean;
}

const navigationDefaultList: NavigationItemType[] = [
  {
    icon: "bar_chart",
    text: "Portfolio",
    to: "/dashboard",
  },
  {
    icon: "account_circle",
    text: "Mis datos",
    to: "/my-data",
  },
  {
    icon: "account_balance",
    text: "Mis cuentas",
    to: "/my-accounts",
  },
  {
    icon: "lock",
    text: "Seguridad",
    to: "/security",
  },
];

const getInitials = (name?: string): string => {
  if (!name) {
    return "CP";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const LeftBar: FC<Props> = ({
  navigationList = navigationDefaultList,
  showUser = false,
  showIcons = false,
}) => {
  const router = useRouter();
  const { userData } = useSelector((state) => state.user);
  const { user } = userData;
  const dispatch = useDispatch();

  const handleOpenLogoutModal = () => {
    dispatch(openLogoutModal());
  };

  const isActive = (to: string) => {
    const href = to.startsWith("/") ? to : `/${to}`;

    if (href.includes("#")) {
      return router.asPath === href;
    }

    return router.pathname === href;
  };

  return (
    <Box
      sx={{
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        position: { md: "sticky" },
        top: { md: 80 },
        width: "100%",
      }}
    >
      {showUser && (
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: "background.paper",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            p: 2,
            textAlign: "center",
          }}
        >
          <Avatar
            alt={user?.full_name}
            src={user?.avatar}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: 24,
              fontWeight: 700,
              height: 72,
              width: 72,
            }}
          >
            {getInitials(user?.full_name)}
          </Avatar>
          <Typography
            noWrap
            sx={{ maxWidth: "100%" }}
            variant="subtitle1"
          >
            {user?.full_name || "Mi cuenta"}
          </Typography>
          <Typography
            color="textSecondary"
            noWrap
            sx={{ maxWidth: "100%" }}
            variant="caption"
          >
            {user?.email}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          backgroundColor: "background.paper",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 2,
          p: 1,
        }}
      >
        <Stack
          component="nav"
          aria-label="Navegación de la cuenta"
          spacing={0.5}
        >
          {navigationList.map((item) => (
            <NavigationItem
              active={isActive(item.to)}
              key={item.to}
              navigationItem={item}
              showIcons={showIcons}
            />
          ))}
        </Stack>

        {showUser && (
          <>
            <Divider sx={{ my: 1 }} />
            <Button
              fullWidth
              onClick={handleOpenLogoutModal}
              startIcon={<LogoutIcon fontSize="small" />}
              sx={{
                justifyContent: "flex-start",
                px: 1.5,
                py: 1,
                textTransform: "none",
              }}
              variant="text"
            >
              Cerrar sesión
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
