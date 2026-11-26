import { Box, Chip, List, Typography } from "@mui/material";
import { FC, Fragment } from "react";
import { TransactionsProps } from "../interfaces/transactions";
import { TransactionSkeleton } from "./transaction-skeleton";

const amountByType = (amount: string, type: string) =>
  type === "withdrawal" || type === "retiro" ? `-${amount}` : amount;

export const Transactions: FC<TransactionsProps> = ({
  transactions,
  showLoader,
}) => {
  if (showLoader) {
    return (
      <Box>
        <TransactionSkeleton />
        <TransactionSkeleton />
        <TransactionSkeleton />
      </Box>
    );
  }

  if (!transactions.length) {
    return (
      <Box
        sx={{
          color: "text.secondary",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">Todavía no tenés movimientos.</Typography>
      </Box>
    );
  }

  return (
    <List
      disablePadding
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {transactions.map(
        (
          {
            id,
            type,
            text,
            formatedAmount,
            formatedDate,
            transactionTypeDescription,
            to,
          },
          index
        ) => (
          <Fragment key={id}>
            <Box
              sx={{
                alignItems: "center",
                display: "grid",
                gap: 1,
                gridTemplateColumns: "minmax(0, 1fr) minmax(86px, 0.9fr) auto",
                minHeight: 76,
                px: { xs: 1.5, sm: 2 },
                py: 1.25,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{ fontSize: "0.82rem", fontWeight: 700 }}
                >
                  {text}
                </Typography>
                <Typography
                  color="textSecondary"
                  sx={{ fontSize: "0.68rem", mt: 0.35 }}
                >
                  {formatedDate}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  color="primary.main"
                  sx={{ fontSize: "0.75rem", fontWeight: 700 }}
                >
                  {transactionTypeDescription}
                </Typography>
                <Typography
                  color="textSecondary"
                  noWrap
                  sx={{ fontSize: "0.68rem", mt: 0.35 }}
                >
                  {to || "Cuenta"}
                </Typography>
              </Box>

              <Chip
                label={amountByType(formatedAmount, type)}
                size="small"
                sx={{
                  backgroundColor: "primary.main",
                  color: "#1C1C1C",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  height: 28,
                  maxWidth: 88,
                }}
              />
            </Box>
            {index < transactions.length - 1 && (
              <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            )}
          </Fragment>
        )
      )}
    </List>
  );
};
