import { Box, ButtonBase, Chip, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "src/store";
import { setCurrency } from "src/slices/currency-slice";
import { LineChart } from "./line-chart";

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const BalanceCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.userData);
  const { change, currency } = useSelector((state) => state.currency);
  const available = user?.balance.available || 0;
  const amount = currency === "ARS" ? available * change : available;

  const changeCurrency = (nextCurrency: "ARS" | "USDT") => {
    dispatch(setCurrency(nextCurrency));
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: 0,
        borderRadius: 2,
        minHeight: 290,
        overflow: "hidden",
        p: 2,
        position: "relative",
        width: "100%",
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
      >
        <Typography variant="h5">Balance</Typography>
        <Box
          aria-label="Moneda del balance"
          sx={{
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 2,
            display: "flex",
            p: "3px",
          }}
        >
          {(["ARS", "USDT"] as const).map((option) => (
            <ButtonBase
              aria-pressed={currency === option}
              key={option}
              onClick={() => changeCurrency(option)}
              sx={{
                backgroundColor: currency === option ? "primary.main" : "transparent",
                borderRadius: 1,
                color: currency === option ? "#1C1C1C" : "#626262",
                fontSize: 11,
                fontWeight: 700,
                minHeight: 25,
                px: 1.25,
                transition: "background-color 150ms ease",
              }}
            >
              {option}
            </ButtonBase>
          ))}
        </Box>
      </Stack>

      <Stack
        spacing={1}
        sx={{ mt: 3, position: "relative", zIndex: 1 }}
      >
        <Typography variant="body2">Balance disponible</Typography>
        <Typography
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
            fontWeight: 700,
            lineHeight: 1.1,
            wordBreak: "break-word",
          }}
        >
          ${formatAmount(amount)} {currency}
        </Typography>
        <Chip
          color="primary"
          label="+12%"
          size="small"
          sx={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(0, 255, 51, 0.14)",
            color: "primary.main",
            fontWeight: 700,
          }}
          variant="outlined"
        />
      </Stack>

      <Box
        sx={{
          bottom: 4,
          height: 145,
          position: "absolute",
          right: 6,
          width: { xs: "58%", sm: "50%" },
        }}
      >
        <LineChart
          height={145}
          width="100%"
        />
      </Box>
    </Box>
  );
};
