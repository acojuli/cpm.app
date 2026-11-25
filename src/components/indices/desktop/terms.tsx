import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

const rows = [
  { title: "Categoría", value: "FONDO CRIPTO" },
  { title: "Plazo mínimo", value: "NO HAY" },
  { title: "Plazo máximo", value: "99 AÑOS" },
  { title: "Lanzamiento", value: "17/03/2023" },
  { title: "Suscripciones", value: "SEMANAL (MIER 16H ARG)" },
  { title: "Plazo de rescate", value: "48 HORAS" },
  { title: "Comisión por rescate", value: "0% / 0.5%" },
  { title: "Comisión por rentabilidad", value: "0%" },
  { title: "Comisión por administración", value: "2,75% ANUAL" },
  { title: "Aporte mínimo", value: "50.000 AR$" },
];

export const Terms = () => {
  return (
    <>
      <Typography
        mb={2}
        variant="h3"
      >
        Términos
      </Typography>

      <TableContainer
        sx={{
          border: "1px solid rgba(245, 250, 255, 0.7)",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.title}
                sx={{
                  height: 57,
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell sx={{ fontSize: 14, pl: 3 }}>{row.title}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "text.secondary", fontSize: 13, pr: 3 }}
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
