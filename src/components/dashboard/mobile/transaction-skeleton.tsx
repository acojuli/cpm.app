import { Box, Skeleton } from "@mui/material";

export const TransactionSkeleton = () => (
  <Box
    sx={{
      alignItems: "center",
      backgroundColor: "background.paper",
      display: "grid",
      gap: 1,
      gridTemplateColumns: "1fr 1fr 76px",
      minHeight: 76,
      px: 1.5,
      py: 1.25,
      "&:not(:last-child)": {
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      },
    }}
  >
    <Box>
      <Skeleton height={18} width={70} />
      <Skeleton height={15} width={58} />
    </Box>
    <Box>
      <Skeleton height={18} width={72} />
      <Skeleton height={15} width={54} />
    </Box>
    <Skeleton
      height={28}
      variant="rectangular"
      width={72}
    />
  </Box>
);
