import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { useSelector } from "src/store";
import { Transactions } from "./transactions";

export const MyTransactions: FC = () => {
  const { transactions, loading } = useSelector((state) => state.transactions);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{ mb: 1.5 }}
        variant="h4"
      >
        Mis movimientos
      </Typography>
      <Transactions
        showLoader={loading}
        transactions={transactions}
      />
    </Box>
  );
};
