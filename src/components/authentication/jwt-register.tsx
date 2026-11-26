import { useState, type FC } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  Link,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useMounted } from "../../hooks/use-mounted";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { getSafeReturnUrl } from "src/utils/safe-return-url";
import {
  PASSWORD_POLICY_MESSAGE,
  PASSWORD_REGEX,
} from "src/utils/password-policy";

export const JWTRegister: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      policy: false,
      submit: null,
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .trim()
        .max(60, "El nombre es demasiado largo")
        .required("Nombre es requerido"),
      lastname: Yup.string()
        .trim()
        .max(60, "El apellido es demasiado largo")
        .required("Apellido es requerido"),
      email: Yup.string()
        .trim()
        .email("Debes ingresar un email valido")
        .max(255)
        .required("Email es requerido"),
      password: Yup.string()
        .matches(PASSWORD_REGEX, PASSWORD_POLICY_MESSAGE)
        .required("Password es requerido"),
      passwordConfirmation: Yup.string()
        .required("Debes confirmar la contraseña")
        .oneOf(
          [Yup.ref("password"), null],
          "Debe ser igual a la contraseña"
        ),
      policy: Yup.boolean().oneOf(
        [true],
        "Debes aceptar los Terminos y condiciones"
      ),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await register(
          values.firstname.trim(),
          values.lastname.trim(),
          values.email.trim(),
          values.password
        );

        if (isMounted()) {
          const returnUrl = getSafeReturnUrl(
            router.query.returnUrl,
            "/email-verification"
          );
          router.push(returnUrl).catch(console.error);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit} {...props}>
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error" variant="outlined">
            {formik.errors.submit}
          </Alert>
        </Box>
      )}
            <TextField
        error={Boolean(formik.touched.firstname && formik.errors.firstname)}
        fullWidth
        helperText={formik.touched.firstname && formik.errors.firstname}
        label="Nombre"
        margin="normal"
        placeholder="tu nombre"
        name="firstname"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="firstname"
        value={formik.values.firstname}
        variant="outlined"
      />
            <TextField
        error={Boolean(formik.touched.lastname && formik.errors.lastname)}
        fullWidth
        helperText={formik.touched.lastname && formik.errors.lastname}
        label="Apellido"
        margin="normal"
        placeholder="tu apellido"
        name="lastname"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="lastname"
        value={formik.values.lastname}
        variant="outlined"
      />
      <TextField
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        helperText={formik.touched.email && formik.errors.email}
        label="Email"
        placeholder='tu email'
        margin="normal"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
        variant="outlined"
      />
      <FormControl
        fullWidth 
        variant="outlined" 
        margin="normal"
      >
          <InputLabel 
              htmlFor="outlined-adornment-password"
              error={Boolean(formik.touched.password && formik.errors.password)}
            >
              Contraseña
            </InputLabel>
          <OutlinedInput
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            name="password"
            label="Contraseña"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type={showPassword? "text":"password"}
            value={formik.values.password}
            placeholder='tu contraseña'
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        {!!Boolean(formik.touched.password && formik.errors.password) && (
          <FormHelperText 
            error 
            id="accountId-error"
          >
          {formik.touched.password && formik.errors.password}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl
        fullWidth 
        variant="outlined" 
        margin="normal"
      >
          <InputLabel 
              htmlFor="outlined-adornment-password-confirmation"
              error={Boolean(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
            >
              Confirmá tu contraseña
            </InputLabel>
          <OutlinedInput
            error={Boolean(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
            fullWidth
            name="passwordConfirmation"
            label="Confirmá tu contraseña"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type={showPassword? "text":"password"}
            value={formik.values.passwordConfirmation}
            placeholder='confirmá tu contraseña'
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        {!!Boolean(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation) && (
          <FormHelperText 
            error 
            id="accountId-error"
          >
          {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
          </FormHelperText>
        )}
      </FormControl>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          ml: -1,
          mt: 2,
        }}
      >
        <Checkbox
          checked={formik.values.policy}
          name="policy"
          onChange={formik.handleChange}
        />
        <Typography color="textSecondary" variant="body2">
          Acepto los{" "}
          <Link
            component="a"
            href="/terminos"
            rel="noopener noreferrer"
            target="_blank"
          >
            Términos y Condiciones
          </Link>
        </Typography>
      </Box>
      {Boolean(formik.touched.policy && formik.errors.policy) && (
        <FormHelperText error>{formik.errors.policy}</FormHelperText>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Crear cuenta
        </Button>
      </Box>
    </form>
  );
};
