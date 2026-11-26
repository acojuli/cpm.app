import { Chip, IconButton, Stack, Typography, Box } from "@mui/material";
import React, { FC } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DeleteIcon from "@mui/icons-material/Delete";
import { Account } from "src/types/user-data/account";

interface Props {
  myAccounts: Account[];
  handleDeleteAccount: (id: string) => void;
}
export const AccountList: FC<Props> = ({ myAccounts, handleDeleteAccount }) => {
  return (
    <Stack
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 1.5,
        overflow: "hidden",
      }}
    >
      {myAccounts.map(({ id, name, cbu, coin }) => (
        <Stack
          alignItems="center"
          direction="row"
          key={id}
          spacing={2}
          sx={{
            px: 2,
            py: 1.5,
            "&:not(:last-child)": {
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(0, 255, 51, 0.1)",
              borderRadius: 1.5,
              color: "primary.main",
              display: "flex",
              flexShrink: 0,
              height: 40,
              justifyContent: "center",
              width: 40,
            }}
          >
            <AccountBalanceIcon fontSize="small" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              noWrap
              sx={{ fontWeight: 600 }}
            >
              {name}
            </Typography>
            <Typography
              color="textSecondary"
              noWrap
              sx={{ fontSize: 13 }}
            >
              {cbu}
            </Typography>
          </Box>
          <Chip
            color="primary"
            label={coin}
            size="small"
            sx={{ fontWeight: 700 }}
          />
          <IconButton
            aria-label={`Eliminar ${name}`}
            onClick={() => handleDeleteAccount(id)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  );
};
