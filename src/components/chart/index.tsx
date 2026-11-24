import React, { useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
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

const Chart = () => {
  const { error, isLoading, performanceData } = useSelector(
    (state: RootState) => state.performance
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPerformance());
  }, [dispatch]);

  const chartData = useMemo<ChartData[]>(() => {
    return (performanceData || []).map((item) => ({
      Fecha: format(new Date(item.label), "dd/MM"),
      Performance: Number(item.perform.toFixed(2)),
    }));
  }, [performanceData]);

  if (isLoading) {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: 200,
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
    );
  }

  if (error || chartData.length === 0) {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: 200,
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
    );
  }

  return (
    <Box sx={{ height: 200, width: "100%" }}>
      <ResponsiveContainer
        height="100%"
        width="100%"
      >
        <LineChart
          data={chartData}
          margin={{ bottom: 0, left: -18, right: 8, top: 8 }}
        >
          <XAxis
            axisLine={false}
            dataKey="Fecha"
            minTickGap={16}
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
            tick={{ fontSize: 11 }}
            tickLine={false}
            width={44}
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
            dot={false}
            stroke="#FFF"
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
