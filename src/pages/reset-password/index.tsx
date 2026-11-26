import { Box, Container, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import { MainLayout } from "src/components/main-layout";
import { FormResetPassword as RequestResetPasswordForm } from "src/components/reset-password";
import Router from "next/router";
import { MyAccountNotification } from "src/components/common/notification/my-account-notification";
import { FormResetPassword as SetNewPasswordForm } from "src/components/account/mobile/security";

interface Props {
  resetPasswordToken: string;
}
// /auth/reset-password
const ResetPassword: NextPage<Props> = ({ resetPasswordToken }) => {
  const redirect = () => {
    Router.push("/login");
  };
  return (
    <Box
      component="main"
      sx={{
        py: { md: 12, xs: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            color="primary"
            variant="overline"
          >
            Recuperar acceso
          </Typography>
          <Typography
            component="h1"
            sx={{ fontSize: { md: 36, xs: 28 }, fontWeight: 700, mt: 0.5 }}
          >
            {resetPasswordToken
              ? "Creá una nueva contraseña"
              : "Recuperá el acceso a tu cuenta"}
          </Typography>
        </Box>
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="stretch"
        >
          <MyAccountNotification
            currentTab="security"
            showError
            showSuccess
          />
          {resetPasswordToken ? (
            <SetNewPasswordForm
              token={resetPasswordToken}
              redirect={redirect}
            />
          ) : (
            <RequestResetPasswordForm />
          )}
        </Grid>
      </Container>
    </Box>
  );
};

ResetPassword.getInitialProps = async ({ query }) => {
  const token = query.token?.toString() ?? "";
  return { resetPasswordToken: token };
};
ResetPassword.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default ResetPassword;
