import {
    Button,
    Grid,
    Stack,
    TextField,
  } from "@mui/material";
  import * as Yup from "yup";
  import { useFormik } from "formik";
  import { SettingsCard } from "src/components/account/settings-card";
  import ApiClient from "../../services/api-client";
  import { toApiError } from "../../services/api-auth";
  import {
    errorNotification,
    succesNotification,
  } from "src/slices/my-account-notificacion-slice";
  import { useDispatch } from "src/store";
  import { FC } from "react";
  
  export const FormResetPassword: FC = () => {
    const dispatch = useDispatch();
    const formik = useFormik({
      initialValues: {
        email: "",
        submit: null,
      },
      validationSchema: Yup.object({
        email: Yup.string()
          .email("Debes ingresar un correo valido")
          .required("Debes ingresar tu correo"),
      }),
      onSubmit: async (values, helpers): Promise<void> => {
        try {
          await ApiClient.post("/auth/reset-password", {
            email: values.email,
          });
          helpers.resetForm();
          dispatch(
            succesNotification({
              msg: "Si el email está registrado, vas a recibir un correo para reiniciar tu contraseña",
              tab: "security",
            })
          );
        } catch (error) {
          dispatch(
            errorNotification({
              msg: toApiError(error, "Ha ocurrido un error").message,
              tab: "security",
            })
          );
        }
      },
    });
    return (
      <Grid
        item
        md={12}
        xs={12}
      >
        <SettingsCard
          description="Ingresá el email de tu cuenta y te enviaremos un enlace para crear una nueva contraseña."
          title="Reiniciá tu contraseña"
        >
          <Stack
            component="form"
            onSubmit={formik.handleSubmit}
            spacing={2}
          >
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="tu@email.com"
              type="email"
              value={formik.values.email}
            />
            <Button
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {formik.isSubmitting ? "Enviando..." : "Enviar enlace"}
            </Button>
          </Stack>
        </SettingsCard>
      </Grid>
    );
  };