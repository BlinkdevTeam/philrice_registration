"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

type ChartItem = {
  name: string;
  value: number;
};

interface PieChartCardProps {
  title: string;
  data: ChartItem[];
  colors: string[];
  total?: number; // optional, used for percentage labels
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  colors,
  total,
}) => {
  const renderLabel = (props: PieLabelRenderProps) => {
    const { name, value } = props as unknown as { name: string; value: number };
    const percentage =
      total && total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
    return `${name}: ${value} (${percentage}%)`;
  };

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
              label={total ? renderLabel : undefined}
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
    </div>
  );
};

export default PieChartCard;
