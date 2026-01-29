"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LanguageData } from "../../types";

interface Props {
  data: LanguageData[];
}

export function LanguageChart({ data }: Props) {
  if (data.length === 0) return null;

  // Add fill property for recharts 3.x (Cell is deprecated)
  const chartData = data.map((item) => ({
    ...item,
    fill: item.color,
  }));

  return (
    <div className="flex h-50 w-full flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(value) => [`${value} repos`]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-2">
        {data.slice(0, 4).map((item) => (
          <div key={item.name} className="flex items-center gap-1 text-[10px]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
