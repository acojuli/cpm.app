import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { CommonModal } from "src/components/common";
import { Notification } from "src/components/common/notification";
import { DepositMoneyForm, InvestMoneyForm } from "src/components/invest";
import { useSelector } from "src/store";
import { BalanceCard } from "./balance-card";
import { MyTransactions } from "./my-transactions";
import { Packs } from "./packs";

export const MobileDashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openInvestModal, setOpenInvestModal] = useState(false);
  const { user } = userData;

  const handleCloseDepositModal = () => setOpenDepositModal(false);
  const handleCloseInvestModal = () => setOpenInvestModal(false);

  return (
    <Box
      sx={{
        mx: "auto",
        pb: 5,
        pt: { md: 1, xs: 0.5 },
        width: "100%",
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography
            sx={{
              fontSize: { sm: 30, xs: 27 },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
            variant="h1"
          >
            ¡Hola {user?.firstname} {user?.lastname}!
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            <Notification
              currentPage="dashboard"
              showError
              showSuccess
            />
          </Box>
        </Box>

        <Button
          fullWidth
          onClick={() => setOpenDepositModal(true)}
          sx={{
            borderRadius: 1.5,
            fontWeight: 700,
            minHeight: 54,
          }}
          variant="contained"
        >
          Ingresar dinero
        </Button>

        <BalanceCard />
        <Packs onInvest={() => setOpenInvestModal(true)} />
        <MyTransactions />
      </Stack>

      <CommonModal
        handleClose={handleCloseInvestModal}
        open={openInvestModal}
      >
        <InvestMoneyForm closeModal={handleCloseInvestModal} />
      </CommonModal>
      <CommonModal
        handleClose={handleCloseDepositModal}
        open={openDepositModal}
      >
        <DepositMoneyForm closeModal={handleCloseDepositModal} />
      </CommonModal>
    </Box>
  );
};
