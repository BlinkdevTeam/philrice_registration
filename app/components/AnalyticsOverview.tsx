"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type TotalData = {
  maleCount: number;
  femaleCount: number;
  total: number;
  indigenousYes: number;
  indigenousNo: number;
  disabilityYes: number;
  disabilityNo: number;
  ageBracketCounts: Record<string, number>;
};

type ChartItem = {
  name: string;
  value: number;
};

type DailyDataItem = {
  date: string;
  male: number;
  female: number;
  total: number;
};

export default function AnalyticsOverview() {
  const [data, setData] = useState<TotalData>({
    maleCount: 0,
    femaleCount: 0,
    total: 0,
    indigenousYes: 0,
    indigenousNo: 0,
    disabilityYes: 0,
    disabilityNo: 0,
    ageBracketCounts: {},
  });

  const [dailyData, setDailyData] = useState<DailyDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch total participant data (no filters)
        const res = await fetch(`/api/total-participant`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success) {
          setData({
            maleCount: json.maleCount ?? 0,
            femaleCount: json.femaleCount ?? 0,
            total: json.total ?? 0,
            indigenousYes: json.indigenousYes ?? 0,
            indigenousNo: json.indigenousNo ?? 0,
            disabilityYes: json.disabilityYes ?? 0,
            disabilityNo: json.disabilityNo ?? 0,
            ageBracketCounts: json.ageBracketCounts ?? {},
          });
        }

        // Fetch per-day attendance (no filters)
        const dailyRes = await fetch(`/api/participant-attended`, {
          cache: "no-store",
        });
        const dailyJson = await dailyRes.json();

        if (dailyJson.success && dailyJson.perDaySummary) {
          const formattedDaily: DailyDataItem[] = Object.entries(
            dailyJson.perDaySummary
          ).map(([date, summary]) => {
            const s = summary as {
              sex: { male: number; female: number };
            };
            return {
              date,
              male: s.sex.male || 0,
              female: s.sex.female || 0,
              total: (s.sex.male || 0) + (s.sex.female || 0),
            };
          });
          setDailyData(formattedDaily);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading analytics...
      </div>
    );
  }

  // --- Prepare chart data ---
  const sexData: ChartItem[] = [
    { name: "Male", value: data.maleCount },
    { name: "Female", value: data.femaleCount },
  ];

  const indigenousData: ChartItem[] = [
    { name: "Indigenous (Yes)", value: data.indigenousYes },
    { name: "Non-Indigenous (No)", value: data.indigenousNo },
  ];

  const disabilityData: ChartItem[] = [
    { name: "With Disability", value: data.disabilityYes },
    { name: "Without Disability", value: data.disabilityNo },
  ];

  const ageBracketData: ChartItem[] = Object.entries(data.ageBracketCounts).map(
    ([name, value]) => ({ name, value })
  );

  // --- Colors ---
  const SEX_COLORS = ["#3B82F6", "#EC4899"];
  const INDIGENOUS_COLORS = ["#10B981", "#F59E0B"];
  const DISABILITY_COLORS = ["#6366F1", "#9CA3AF"];
  const BAR_COLOR = "#3B82F6";

  const renderLabel = (props: PieLabelRenderProps, total: number) => {
    const { name, value } = props as unknown as { name: string; value: number };
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
    return `${name}: ${value} (${percentage}%)`;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-8">
      {/* 🧍 Sex Distribution */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Participant Distribution by Sex
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={sexData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                labelLine={false}
                label={(props) => renderLabel(props, data.total)}
              >
                {sexData.map((entry, index) => (
                  <Cell
                    key={`cell-sex-${index}`}
                    fill={SEX_COLORS[index % SEX_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🌾 Indigenous Distribution */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Indigenous Participants
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={indigenousData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                labelLine={false}
                label={(props) =>
                  renderLabel(props, data.indigenousYes + data.indigenousNo)
                }
              >
                {indigenousData.map((entry, index) => (
                  <Cell
                    key={`cell-indigenous-${index}`}
                    fill={INDIGENOUS_COLORS[index % INDIGENOUS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ♿ Disability Distribution */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Participants with Disability
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={disabilityData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                labelLine={false}
                label={(props) =>
                  renderLabel(props, data.disabilityYes + data.disabilityNo)
                }
              >
                {disabilityData.map((entry, index) => (
                  <Cell
                    key={`cell-disability-${index}`}
                    fill={DISABILITY_COLORS[index % DISABILITY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 Age Bracket Distribution */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Age Bracket Distribution
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageBracketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={BAR_COLOR} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 Total Attendance Per Day */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Total Attendees Per Day
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
              <Bar dataKey="male" name="Male" stackId="a" fill="#3B82F6" />
              <Bar dataKey="female" name="Female" stackId="a" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
