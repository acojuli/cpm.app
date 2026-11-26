import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "src/store";
import * as Yup from "yup";
import { useFormik } from "formik";
import request from "src/services/api-client";

interface InputsEnabled {
  userLabel: boolean;
  mailLabel: boolean;
  addressLabel: boolean;
  zipLabel: boolean;
}

type EditableField = {
  key: keyof InputsEnabled;
  name: "username" | "email" | "address" | "zip_code";
  label: string;
  placeholder: string;
};

const editableFields: EditableField[] = [
  {
    key: "userLabel",
    name: "username",
    label: "Usuario",
    placeholder: "Jane Doe",
  },
  {
    key: "mailLabel",
    name: "email",
    label: "Email",
    placeholder: "janedoe@gmail.com",
  },
  {
    key: "addressLabel",
    name: "address",
    label: "Domicilio",
    placeholder: "Avenida San Martin 100",
  },
  {
    key: "zipLabel",
    name: "zip_code",
    label: "Código Postal",
    placeholder: "1722",
  },
];

export const MyDataFormDesktop = () => {
  const { userData } = useSelector((state) => state.user);
  const { user } = userData;
  const [loading, setLoading] = useState(false);
  const [openSucces, setOpenSucces] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [disabled, setDisabled] = useState<InputsEnabled>({
    userLabel: false,
    mailLabel: false,
    addressLabel: false,
    zipLabel: false,
  });

  const enabled = (inputName: keyof InputsEnabled) => {
    setDisabled((prevEnabled) => ({
      ...prevEnabled,
      [inputName]: !prevEnabled[inputName],
    }));
  };

  const validationSchema = Yup.object({
    username: Yup.string(),

    email: Yup.string().email("Debes ingresar un email valido"),

    address: Yup.string(),

    zip_code: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      address: user?.address || "",
      zip_code: user?.zip_code || "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        setLoading(true);
        const newData = await request.patch(
          "/users",
          JSON.stringify(values, null, 2)
        );

        if (newData.status === 200) {
          setLoading(false);
          setOpenSucces(true);
        } else {
          setLoading(false);
          setOpenError(true);
        }
      } catch (error) {
        setLoading(false);
        setOpenError(true);
      }
    },
  });

  const readOnlyFields = [
    { label: "Nombre", value: user?.full_name },
    { label: "Nacionalidad", value: user?.country },
    { label: "CUIL", value: user?.legalId },
    { label: "Fecha de nacimiento", value: user?.birthday },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2">Mi cuenta</Typography>
      <Typography
        color="textSecondary"
        sx={{ mt: 0.5 }}
        variant="h3"
      >
        Datos personales
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Collapse in={openSucces}>
          <Alert
            onClose={() => setOpenSucces(false)}
            severity="success"
            sx={{
              backgroundColor: "rgba(0, 255, 51, 0.12)",
              border: "1px solid #00FF33",
              mb: 2,
            }}
          >
            Datos guardados.
          </Alert>
        </Collapse>

        <Collapse in={openError}>
          <Alert
            onClose={() => setOpenError(false)}
            severity="error"
            sx={{ mb: 2 }}
          >
            Oops! Algo salió mal. Por favor intentá más tarde.
          </Alert>
        </Collapse>
      </Box>

      <Box
        sx={{
          backgroundColor: "background.paper",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 2,
          mt: 2,
          p: { md: 3, xs: 2 },
          width: "100%",
        }}
      >
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            md={5}
            xs={12}
          >
            <Typography
              color="textSecondary"
              variant="overline"
            >
              Datos de la cuenta
            </Typography>
            <Stack
              spacing={2}
              sx={{ mt: 1 }}
            >
              {readOnlyFields.map((field) => (
                <Box key={field.label}>
                  <Typography
                    color="textSecondary"
                    variant="caption"
                  >
                    {field.label}
                  </Typography>
                  <Typography variant="body1">
                    {field.value || "—"}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid
            item
            md={7}
            xs={12}
          >
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Typography
                color="textSecondary"
                variant="overline"
              >
                Datos editables
              </Typography>
              <Stack
                spacing={2}
                sx={{ mt: 1 }}
              >
                {editableFields.map((field) => (
                  <TextField
                    disabled={!disabled[field.key]}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    fullWidth
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                    }
                    id={field.name}
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder={field.placeholder}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={`Editar ${field.label}`}
                            edge="end"
                            onClick={() => enabled(field.key)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={formik.values[field.name]}
                  />
                ))}

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    disabled={loading}
                    sx={{ minWidth: { md: 220, xs: "100%" } }}
                    type="submit"
                    variant="contained"
                  >
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
