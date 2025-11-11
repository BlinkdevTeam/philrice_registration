"use client";

import React, { useEffect, useState } from "react";
import PieChartCard from "./PieChartCard";
import BarChartCard from "./BarChartCard";
import ParticipantStats from "./ParticipantStats";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
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

        const dailyRes = await fetch(`/api/participant-attended`, {
          cache: "no-store",
        });
        const dailyJson = await dailyRes.json();
        if (dailyJson.success && dailyJson.perDaySummary) {
          const formattedDaily: DailyDataItem[] = Object.entries(
            dailyJson.perDaySummary
          ).map(([date, summary]) => {
            const s = summary as { sex: { male: number; female: number } };
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading analytics...
      </div>
    );

  // Pie chart data
  const sexData = [
    { name: "Male", value: data.maleCount },
    { name: "Female", value: data.femaleCount },
  ];

  const indigenousData = [
    { name: "Indigenous (Yes)", value: data.indigenousYes },
    { name: "Non-Indigenous (No)", value: data.indigenousNo },
  ];

  const disabilityData = [
    { name: "With Disability", value: data.disabilityYes },
    { name: "Without Disability", value: data.disabilityNo },
  ];

  const ageBracketData = Object.entries(data.ageBracketCounts).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="flex w-full h-full justify-evenly items-center gap-6">
          {/* Top summary cards */}
          <div className="grid grid-cols-2 gap-6 max-w-full w-full">
            <div className="bg-[#F58A1F] h-full flex flex-col justify-center items-center rounded-3xl shadow-lg p-6 text-center border border-gray-200">
              <ParticipantStats total={data.total} />
            </div>

            {/* Pie charts row */}
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <PieChartCard
                title="Sex Distribution"
                data={sexData}
                colors={["#2986cc", "#c90076"]}
              />
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <PieChartCard
                title="Indigenous Participants"
                data={indigenousData}
                colors={["#FFB703", "#5A9E4B"]}
              />
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <PieChartCard
                title="Disability Participants"
                data={disabilityData}
                colors={["#F58A1F", "#006872"]}
              />
            </div>
          </div>

          {/* Bar charts row */}
          <div className="flex flex-col gap-6 max-w-full w-full">
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <BarChartCard
                title="Age Bracket Distribution"
                data={ageBracketData}
                dataKey="value"
                colors={["#006872"]}
              />
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <BarChartCard
                title="Daily Attendance"
                data={dailyData}
                dataKey={["male", "female"]}
                colors={["#006872", "#F58A1F"]}
                stackId="a"
                xAxisKey="date"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
