import { Grid } from "@mui/material";
import React from "react";
import { FormResetPassword, LoginHistory } from "../mobile/security";
import { MultiFactorAuth } from "../mobile/security/multi-factor-auth";

export const DesktopSecurity = () => {
  return (
    <Grid
      container
      item
      lg={12}
      md={12}
      spacing={3}
      sx={{ maxWidth: 860 }}
    >
      <FormResetPassword />
      <MultiFactorAuth />
      <LoginHistory />
    </Grid>
  );
};
