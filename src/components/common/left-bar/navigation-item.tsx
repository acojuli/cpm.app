import type { ReactNode } from "react";
import { Button } from "@mui/material";
import NextLink from "next/link";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { NavigationItem as NavigationItemType } from "src/types/left-bar";

interface Props {
  navigationItem: NavigationItemType;
  active: boolean;
  showIcons: boolean;
}

const icons: Record<string, ReactNode> = {
  bar_chart: <BarChartIcon fontSize="small" />,
  account_circle: <AccountCircleIcon fontSize="small" />,
  account_balance: <AccountBalanceIcon fontSize="small" />,
  lock: <LockOutlinedIcon fontSize="small" />,
};

export const NavigationItem = ({
  navigationItem,
  active,
  showIcons,
}: Props) => {
  const { icon, text, to } = navigationItem;
  const href = to.startsWith("/") ? to : `/${to}`;

  return (
    <NextLink
      href={href}
      passHref
    >
      <Button
        color={active ? "primary" : "inherit"}
        component="a"
        href={href}
        startIcon={showIcons ? icons[icon] || <CircleOutlinedIcon fontSize="small" /> : undefined}
        sx={{
          backgroundColor: active ? "rgba(0, 255, 51, 0.08)" : "transparent",
          justifyContent: "flex-start",
          px: 1.5,
          py: 1,
          textTransform: "none",
          width: "100%",
        }}
        variant="text"
      >
        {text}
      </Button>
    </NextLink>
  );
};
