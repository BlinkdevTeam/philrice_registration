"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartItem = {
  name: string;
  value: number;
};

interface PieChartCardProps {
  title: string;
  data: ChartItem[];
  colors: string[];
  total?: number;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  colors,
  total,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        {title}
      </h2>

      <div className="w-full h-96">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              labelLine={false}
              label={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Values displayed BELOW the chart */}
      <div className="mt-4 flex flex-col gap-1 text-center">
        {data.map((item, index) => {
          const percentage =
            total && total > 0
              ? ((item.value / total) * 100).toFixed(1)
              : "0.0";

          return (
            <p key={index} className="text-sm font-medium">
              {item.name}: <span className="font-bold">{item.value}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default PieChartCard;
