import React, { useEffect, useMemo, useState } from "react";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { getPerformance } from "src/slices/performance-slice";
import { RootState, useDispatch } from "src/store";

interface ChartData {
  Fecha: string;
  Performance: number;
}

interface Props {
  height?: number;
  showRanges?: boolean;
}

const ranges = [
  { label: "7 días", days: 7 },
  { label: "1 mes", days: 30 },
  { label: "1 año", days: 365 },
  { label: "Todo", days: 730 },
];

const Chart = ({ height = 200, showRanges = false }: Props) => {
  const { error, isLoading, performanceData } = useSelector(
    (state: RootState) => state.performance
  );
  const [days, setDays] = useState(showRanges ? ranges[0].days : 9);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPerformance(days));
  }, [dispatch, days]);

  const chartData = useMemo<ChartData[]>(() => {
    return [...(performanceData || [])]
      .sort(
        (a, b) => new Date(a.label).getTime() - new Date(b.label).getTime()
      )
      .map((item) => ({
        Fecha: format(new Date(item.label), "dd/MM"),
        Performance: Number(item.perform.toFixed(2)),
      }));
  }, [performanceData]);

  const rangeTabs = showRanges && (
    <Stack
      direction="row"
      justifyContent="center"
      role="tablist"
      spacing={{ md: 6, xs: 3 }}
      sx={{ mb: 2 }}
    >
      {ranges.map((range) => (
        <ButtonBase
          aria-selected={days === range.days}
          key={range.label}
          onClick={() => setDays(range.days)}
          role="tab"
          sx={{
            borderBottom: "2px solid",
            borderColor: days === range.days ? "primary.main" : "transparent",
            color: days === range.days ? "primary.main" : "text.secondary",
            fontSize: 14,
            fontWeight: 600,
            pb: 0.5,
            px: 0.5,
          }}
        >
          {range.label}
        </ButtonBase>
      ))}
    </Stack>
  );

  if (isLoading && chartData.length === 0) {
    return (
      <>
        {rangeTabs}
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            height,
            justifyContent: "center",
          }}
        >
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Cargando...
          </Typography>
        </Box>
      </>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <>
        {rangeTabs}
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            height,
            justifyContent: "center",
            px: 2,
            textAlign: "center",
          }}
        >
          <Typography
            color="textSecondary"
            variant="caption"
          >
            No hay datos de rendimiento disponibles por el momento.
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      {rangeTabs}
      <Box sx={{ height, width: "100%" }}>
        <ResponsiveContainer
          height="100%"
          width="100%"
        >
          <LineChart
            data={chartData}
            margin={{ bottom: 0, left: 0, right: 8, top: 8 }}
          >
            <XAxis
              axisLine={false}
              dataKey="Fecha"
              minTickGap={24}
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: number) => String(Math.round(value))}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1C1C1C",
                border: "1px solid rgba(245, 250, 255, 0.18)",
                borderRadius: 8,
              }}
              itemStyle={{ color: "#00FF33" }}
            />
            <Line
              activeDot={{ r: 6, fill: "#00FF33" }}
              dataKey="Performance"
              dot={
                showRanges && chartData.length <= 40
                  ? { fill: "#00FF33", r: 4, stroke: "#00FF33" }
                  : false
              }
              stroke="#FFF"
              strokeWidth={showRanges ? 1 : 2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default Chart;
