import React from "react";
import {
  Box,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { Ticket } from "../types";

interface CompositionProps {
  composition: Ticket[];
  loading?: boolean;
}

const formatPercent = (value: number) =>
  `${value.toFixed(2).replace(".", ",")}%`;

export const Composition: FC<CompositionProps> = ({
  composition,
  loading = false,
}) => {
  return (
    <>
      <Typography
        mb={2}
        variant="h3"
      >
        Composición
      </Typography>

      <TableContainer
        sx={{
          border: "1px solid rgba(245, 250, 255, 0.7)",
          borderRadius: 2,
        }}
      >
        {!loading && composition.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              No pudimos cargar la composición del índice.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableBody>
              {(loading ? Array.from({ length: 10 }) : composition).map(
                (content, index) => {
                  const ticket = content as Ticket | undefined;

                  return (
                    <TableRow
                      key={ticket?._id || index}
                      sx={{
                        height: 56,
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        sx={{ pl: 3, py: 1.5, width: 64 }}
                      >
                        {ticket ? (
                          <img
                            alt={ticket.symbol}
                            src={ticket.img}
                            style={{ display: "block", height: 32, width: 32 }}
                          />
                        ) : (
                          <Skeleton
                            height={32}
                            variant="circular"
                            width={32}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, py: 1.5 }}>
                        {ticket ? ticket.name : <Skeleton width={90} />}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ pr: 3, py: 1.5 }}
                      >
                        {ticket ? (
                          <Chip
                            color="success"
                            label={formatPercent(ticket.percent)}
                            size="small"
                            sx={{ fontWeight: 700, minWidth: 64 }}
                          />
                        ) : (
                          <Skeleton
                            height={24}
                            sx={{ ml: "auto" }}
                            width={64}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};
