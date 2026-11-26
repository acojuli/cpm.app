import { Box } from "@mui/material";

interface Props {
  height?: number | string;
  width?: number | string;
}

const values = [18, 24, 37, 29, 48, 63, 42, 72];
const maxValue = Math.max(...values);

export const LineChart = ({ height = 90, width = 180 }: Props) => (
  <Box
    aria-label="Evolución del balance"
    role="img"
    sx={{
      alignItems: "flex-end",
      display: "flex",
      gap: "6%",
      height,
      overflow: "hidden",
      width,
    }}
  >
    {values.map((value, index) => (
      <Box
        key={`${value}-${index}`}
        sx={{
          backgroundColor: "primary.main",
          borderRadius: "3px 3px 0 0",
          flex: 1,
          height: `${(value / maxValue) * 100}%`,
          minWidth: 3,
          opacity: index === values.length - 1 ? 1 : 0.82,
        }}
      />
    ))}
  </Box>
);
