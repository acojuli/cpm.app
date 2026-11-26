import {
  Box,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { PasswordField } from "src/components/common";
import { SettingsCard } from "src/components/account/settings-card";
import {
  errorNotification,
  succesNotification,
} from "src/slices/my-account-notificacion-slice";
import { useDispatch } from "src/store";
import { FC } from "react";
import ApiClient from "src/services/api-client";
import { toApiError } from "src/services/api-auth";
import {
  PASSWORD_POLICY_MESSAGE,
  PASSWORD_REGEX,
} from "src/utils/password-policy";

interface Props {
  token?: string;
  redirect?: () => void;
}
export const FormResetPassword: FC<Props> = ({ token, redirect }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirm: "",
      submit: null,
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(PASSWORD_REGEX, PASSWORD_POLICY_MESSAGE)
        .required("Debes ingresar la nueva contraseña"),
      password_confirm: Yup.string()
        .required("Debes confirmar la nueva contraseña")
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir"),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const payload = {
          password: values.password,
          password_confirm: values.password_confirm,
        };

        if (token) {
          await ApiClient.postWithToken("/users/reset-password", payload, token);
        } else {
          await ApiClient.post("/users/reset-password", payload);
        }

        helpers.resetForm();
        dispatch(
          succesNotification({
            msg: "Cambiaste tu contraseña",
            tab: "security",
          })
        );
        token && redirect?.();
      } catch (error) {
        dispatch(
          errorNotification({
            msg: toApiError(
              error,
              "No se pudo realizar el cambio de contraseña"
            ).message,
            tab: "security",
          })
        );
      }
    },
  });
  return (
    <Grid item xs={12}>
      <SettingsCard
        description={PASSWORD_POLICY_MESSAGE}
        title="Cambiar contraseña"
      >
        <Stack
          component="form"
          onSubmit={formik.handleSubmit}
          spacing={2}
          sx={{ maxWidth: 480 }}
        >
          <PasswordField
            error={formik.errors.password}
            handleBlur={formik.handleBlur}
            value={formik.values.password}
            label="Nueva contraseña"
            handleChange={formik.handleChange}
            name="password"
            touched={formik.touched.password}
            placeholder="Ingresá tu nueva contraseña"
          />
          <PasswordField
            error={formik.errors.password_confirm}
            handleBlur={formik.handleBlur}
            value={formik.values.password_confirm}
            label="Confirmá tu nueva contraseña"
            handleChange={formik.handleChange}
            name="password_confirm"
            touched={formik.touched.password_confirm}
            placeholder="Confirmá tu nueva contraseña"
          />
          <Box>
            <Button
              disabled={Boolean(
                Object.keys(formik.errors).length || formik.isSubmitting
              )}
              sx={{ minWidth: { md: 220, xs: "100%" } }}
              type="submit"
              variant="contained"
            >
              Cambiar contraseña
            </Button>
          </Box>
        </Stack>
      </SettingsCard>
    </Grid>
  );
};
