"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { WalkinForm } from "../types/walkin";

// Colors for charts
const COLORS = ["#2196F3", "#E91E63", "#4CAF50", "#FF9800", "#9C27B0"];

type AnalyticsOverviewProps = {
  participants: WalkinForm[];
};

export default function AnalyticsOverview({
  participants,
}: AnalyticsOverviewProps) {
  const total = participants.length;

  // Sex Distribution
  const maleCount = participants.filter(
    (p) => String(p.sex).toLowerCase() === "male"
  ).length;
  const femaleCount = participants.filter(
    (p) => String(p.sex).toLowerCase() === "female"
  ).length;
  const sexData = [
    { name: "Male", value: maleCount },
    { name: "Female", value: femaleCount },
  ];

  // Age Bracket Distribution
  const ageBrackets: Record<
    "30 years old and below" | "31-45" | "46-59" | "60 years old and above",
    number
  > = {
    "30 years old and below": 0,
    "31-45": 0,
    "46-59": 0,
    "60 years old and above": 0,
  };

  // Count participants based on the exact age_bracket value
  participants.forEach((p) => {
    const bracket = p.age_bracket as
      | "30 years old and below"
      | "31-45"
      | "46-59"
      | "60 years old and above";

    if (bracket && ageBrackets.hasOwnProperty(bracket)) {
      ageBrackets[bracket]++;
    }
  });

  // Convert to Recharts-friendly array
  const ageData = Object.entries(ageBrackets).map(([name, value]) => ({
    name,
    value,
  }));

  // Indigenous Group
  const indigenousYes = participants.filter(
    (p) =>
      p.indigenous_group === true ||
      String(p.indigenous_group).toLowerCase() === "yes"
  ).length;
  const indigenousNo = total - indigenousYes;
  const indigenousData = [
    { name: "Yes", value: indigenousYes },
    { name: "No", value: indigenousNo },
  ];

  // Person with Disability
  const pwdYes = participants.filter(
    (p) =>
      p.person_with_disability === true ||
      String(p.person_with_disability).toLowerCase() === "yes"
  ).length;
  const pwdNo = total - pwdYes;
  const pwdData = [
    { name: "Yes", value: pwdYes },
    { name: "No", value: pwdNo },
  ];

  // Regional Distribution
  const regionMap = new Map<string, number>();
  participants.forEach((p) => {
    const region = (p.region || "Unspecified").trim();
    regionMap.set(region, (regionMap.get(region) || 0) + 1);
  });
  const regionData = Array.from(regionMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  console.log(
    "🌏 Distinct Regions:",
    regionData.map((r) => r.name)
  );

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Sex Distribution */}
      <div className="w-full bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-center font-semibold mb-4">Sex Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sexData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {sexData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Age Bracket Distribution (span 2 columns on lg) */}
      <div className="w-full md:col-span-2 lg:col-span-2 bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-center font-semibold mb-4">
          Age Bracket Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Indigenous Group */}
      <div className="w-full bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-center font-semibold mb-4">Indigenous Group</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={indigenousData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {indigenousData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Person with Disability */}
      <div className="w-full bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-center font-semibold mb-4">
          Person with Disability
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pwdData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pwdData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Distribution (span all columns) */}
      <div className="w-full md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-center font-semibold mb-4">
          Regional Distribution
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
