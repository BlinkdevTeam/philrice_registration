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

      {/* ✅ VALUES BELOW THE CHART */}
      <div className="mt-6 w-full">
        <div className="flex flex-col gap-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              {/* LEFT SIDE → Label (e.g., age bracket or date) */}
              <div className="font-semibold text-gray-700">
                {xAxisKey ? String(item[xAxisKey]) : `Item ${index + 1}`}
              </div>

              {/* RIGHT SIDE → Values */}
              <div className="flex gap-4 text-sm">
                {keys.map((key, i) => (
                  <div key={i}>
                    <span className="text-gray-600">{String(key)}: </span>
                    <span className="font-bold text-gray-900">{item[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChartCard;
