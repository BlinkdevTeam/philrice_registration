"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartCardProps<T extends Record<string, number | string>> {
  title: string;
  data: T[];
  dataKey: keyof T | Array<keyof T>;
  colors: string[];
  stackId?: string;
  xAxisKey?: keyof T;
}

const BarChartCard = <T extends Record<string, number | string>>({
  title,
  data,
  dataKey,
  colors,
  stackId,
  xAxisKey,
}: BarChartCardProps<T>): React.ReactElement => {
  const keys = Array.isArray(dataKey) ? dataKey : [dataKey];

  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        {title}
      </h2>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={(xAxisKey as string) || "name"}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            {keys.map((key, i) => (
              <Bar
                key={String(key)}
                dataKey={key as string}
                name={String(key)}
                stackId={stackId}
                fill={colors[i % colors.length]}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;
