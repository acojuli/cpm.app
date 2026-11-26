import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { SettingsCard } from "src/components/account/settings-card";
import { fetchAccessLogs } from "src/slices/logs-slice";
import { RootState, useDispatch } from "src/store";

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : format(date, "dd/MM/yyyy HH:mm");
};

export const LoginHistory = () => {
  const dispatch = useDispatch();

  const { accessLogs, isLoading, error } = useSelector(
    (state: RootState) => state.accessLogs
  );

  useEffect(() => {
    dispatch(fetchAccessLogs());
  }, [dispatch]);

  const rows = accessLogs?.data || [];

  return (
    <Grid
      item
      xs={12}
    >
      <SettingsCard
        description="Últimos accesos a tu cuenta. Si no reconocés alguno, cambiá tu contraseña."
        title="Historial de ingresos"
      >
        {isLoading ? (
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Cargando...
          </Typography>
        ) : error ? (
          <Typography
            color="error"
            variant="body2"
          >
            No pudimos cargar el historial: {error}
          </Typography>
        ) : rows.length === 0 ? (
          <Typography
            color="textSecondary"
            variant="body2"
          >
            No hay registros de acceso.
          </Typography>
        ) : (
          <Box
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 1.5,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha y hora</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>IP</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Dispositivo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell>{row.ip}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {row.device.substring(0, 80)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </SettingsCard>
    </Grid>
  );
};
