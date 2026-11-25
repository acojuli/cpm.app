import { Button, Grid } from "@mui/material";
import React from "react";
import { SettingsCard } from "src/components/account/settings-card";
import { openLogoutModal } from "src/slices/logout-modal-slice";
import { useDispatch } from "src/store";

export const AccountLogout = () => {
  const dispatch = useDispatch();
  const handleOpenModal = () => {
    dispatch(openLogoutModal());
  };
  return (
    <Grid
      item
      xs={12}
    >
      <SettingsCard
        description="Para volver a ingresar deberás escribir tu usuario y contraseña nuevamente."
        title="Salir de mi cuenta"
      >
        <Button
          fullWidth
          onClick={handleOpenModal}
          variant="outlined"
        >
          Salir de la cuenta
        </Button>
      </SettingsCard>
    </Grid>
  );
};
