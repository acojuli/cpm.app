import { useTheme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";
import { Chart } from "./chart";

interface Props {
  height?: number | string;
  width?: number | string;
}

export const LineChart = ({ height = 90, width = 180 }: Props) => {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
      sparkline: { enabled: true },
      zoom: { enabled: false },
    },
    colors: ["#00FF33"],
    dataLabels: { enabled: false },
    fill: { opacity: 1 },
    grid: {
      padding: { bottom: 0, left: 0, right: 0, top: 8 },
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "62%",
      },
    },
    states: {
      normal: { filter: { type: "none", value: 0 } },
    },
    theme: { mode: theme.palette.mode },
    tooltip: { enabled: false },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
  };

  const chartSeries = [{ data: [18, 24, 37, 29, 48, 63, 42, 72] }];

  return (
    <Chart
      height={height}
      options={chartOptions}
      series={chartSeries}
      type="bar"
      width={width}
    />
  );
};
