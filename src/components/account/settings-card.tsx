import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export const SettingsCard = ({
  title,
  description,
  action,
  children,
}: Props) => (
  <Box
    sx={{
      backgroundColor: "background.paper",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: 2,
      p: { md: 3, xs: 2.5 },
      width: "100%",
    }}
  >
    <Stack
      alignItems="flex-start"
      direction="row"
      justifyContent="space-between"
      spacing={2}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="h2"
          sx={{ fontSize: 18, fontWeight: 700 }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            color="textSecondary"
            sx={{ fontSize: 14, lineHeight: 1.6, mt: 0.5 }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
    {children && <Box sx={{ mt: 3 }}>{children}</Box>}
  </Box>
);
