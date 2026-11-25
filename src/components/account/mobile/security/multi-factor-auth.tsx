import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
} from "@mui/material";
import React, { useState } from "react";
import { SettingsCard } from "src/components/account/settings-card";

export const MultiFactorAuth = () => {
  const [enabled, setEnabled] = useState(false);
  const [method, setMethod] = useState("email");

  return (
    <Grid
      item
      xs={12}
    >
      <SettingsCard
        action={
          <Switch
            checked={enabled}
            inputProps={{ "aria-label": "Activar autenticación en dos pasos" }}
            onChange={(event) => setEnabled(event.target.checked)}
          />
        }
        description="La autenticación de dos factores agrega una instancia de seguridad al inicio de sesión en tu cuenta. Te recomendamos activar esta herramienta para mayor seguridad."
        title="Autenticación en dos pasos"
      >
        <FormControl disabled={!enabled}>
          <RadioGroup
            name="auth-type"
            onChange={(event) => setMethod(event.target.value)}
            value={method}
          >
            <FormControlLabel
              control={<Radio />}
              label="Email"
              value="email"
            />
            <FormControlLabel
              control={<Radio />}
              label="Teléfono celular"
              value="cellphone"
            />
          </RadioGroup>
        </FormControl>
      </SettingsCard>
    </Grid>
  );
};
