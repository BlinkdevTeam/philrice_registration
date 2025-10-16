"use client";

import React from "react";
import { WalkinForm } from "../types/walkin";

type ParticipantStatsProps = {
  participants: WalkinForm[];
};

export default function ParticipantStats({
  participants,
}: ParticipantStatsProps) {
  const total = participants.length;

  const maleCount = participants.filter(
    (p) => String(p.sex).toLowerCase() === "male"
  ).length;
  const femaleCount = participants.filter(
    (p) => String(p.sex).toLowerCase() === "female"
  ).length;

  const indigenousCount = participants.filter(
    (p) =>
      p.indigenous_group === true ||
      String(p.indigenous_group).toLowerCase() === "yes"
  ).length;

  const disabilityCount = participants.filter(
    (p) =>
      p.person_with_disability === true ||
      String(p.person_with_disability).toLowerCase() === "yes"
  ).length;

  // Handle distinct regions (remove null/undefined)
  const regionSet = new Set(
    participants
      .map((p) => p.region)
      .filter((r): r is string => typeof r === "string" && r.trim() !== "")
  );

  // Helper to calculate percentage safely
  const percent = (count: number) =>
    total ? ((count / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      {/* Total Participants */}
      <div className="bg-white rounded-lg shadow p-5 text-center border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Total Participants
        </h2>
        <p className="text-4xl font-bold text-blue-600 mb-3">{total}</p>
        <p className="text-gray-600 text-sm">
          {maleCount} Male, {femaleCount} Female
        </p>
      </div>

      {/* Indigenous Group */}
      <div className="bg-white rounded-lg shadow p-5 text-center border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Indigenous Group
        </h2>
        <p className="text-4xl font-bold text-purple-600 mb-3">
          {indigenousCount}
        </p>
        <p className="text-gray-600 text-sm">
          {percent(indigenousCount)}% of total
        </p>
      </div>

      {/* With Disability */}
      <div className="bg-white rounded-lg shadow p-5 text-center border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          With Disability
        </h2>
        <p className="text-4xl font-bold text-green-600 mb-3">
          {disabilityCount}
        </p>
        <p className="text-gray-600 text-sm">
          {percent(disabilityCount)}% of total
        </p>
      </div>

      {/* Regions */}
      <div className="bg-white rounded-lg shadow p-5 text-center border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Regions</h2>
        <p className="text-4xl font-bold text-pink-600 mb-3">
          {regionSet.size}
        </p>
        <p className="text-gray-600 text-sm">Distinct regions</p>
      </div>
    </div>
  );
}
