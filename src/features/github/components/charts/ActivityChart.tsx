"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ActivityData } from "../../types";

interface Props {
  data: ActivityData[];
}

export function ActivityChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRepos" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="oklch(0.696 0.17 162.48)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="oklch(0.696 0.17 162.48)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`${value} updated`]}
          />
          <Area
            type="monotone"
            dataKey="repos"
            stroke="oklch(0.696 0.17 162.48)"
            strokeWidth={2}
            fill="url(#colorRepos)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
