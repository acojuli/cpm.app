import { Box, Button, Stack, Typography } from "@mui/material";
import { useDispatch } from "src/store";
import { succesNotification } from "src/slices/notification-slice";

interface Props {
  onInvest: () => void;
}

const packs = [
  {
    image: "/static/home/foundation.svg",
    name: "Foundation",
    amount: 2_840,
  },
  {
    image: "/static/home/p2e.svg",
    name: "P2E: Axies",
    amount: 1_260,
  },
];

const formatCurrency = (amount: number) =>
  `$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(amount)}`;

export const Packs = ({ onInvest }: Props) => {
  const dispatch = useDispatch();

  const handleWithdraw = () => {
    dispatch(
      succesNotification({
        msg: "Los retiros estarán disponibles próximamente.",
        page: "dashboard",
      })
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{ mb: 1.5 }}
        variant="h4"
      >
        Mis packs
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          width: "100%",
        }}
      >
        {packs.map((pack) => (
          <Box
            key={pack.name}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              minWidth: 0,
              overflow: "hidden",
              p: 1.5,
            }}
          >
            <Box
              alt={pack.name}
              component="img"
              src={pack.image}
              sx={{
                backgroundColor: pack.name === "Foundation" ? "#071711" : "#34243B",
                borderRadius: 1.5,
                display: "block",
                height: { xs: 74, sm: 105 },
                objectFit: "cover",
                width: "100%",
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                fontWeight: 700,
                mt: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {pack.name}
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ fontSize: "0.78rem", mt: 0.25, minHeight: 19 }}
              variant="body2"
            >
              {formatCurrency(pack.amount)} USDT
            </Typography>

            <Stack
              spacing={0.75}
              sx={{ mt: 1.5 }}
            >
              <Button
                fullWidth
                onClick={onInvest}
                size="small"
                sx={{ minHeight: 34, px: 0.5 }}
                variant="contained"
              >
                Invertir fondo
              </Button>
              <Button
                fullWidth
                onClick={handleWithdraw}
                size="small"
                sx={{ minHeight: 34, px: 0.5 }}
                variant="outlined"
              >
                Retirar
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
