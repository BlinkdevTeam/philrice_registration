"use client";

import React, { useState } from "react";
import Image from "next/image";

type SidebarProps = {
  activeTab: "analytics" | "participants";
  setActiveTab: (tab: "analytics" | "participants") => void;
  selectedFilters: {
    sex: string[];
    age: string[];
    indigenous: string[];
    disability: string[];
    region: string[];
  };
  toggleFilter: (
    category: keyof SidebarProps["selectedFilters"],
    value: string
  ) => void;
  handleLogout: () => void;
};

// ✅ Multi-select dropdown for regions
const RegionDropdown = ({
  selectedRegions,
  toggleRegion,
}: {
  selectedRegions: string[];
  toggleRegion: (region: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const regions = [
    "Region 1",
    "Region 2",
    "Region 3",
    "Region 4A",
    "Region 4B",
    "Region 5",
    "Region 6",
    "Region 7",
    "Region 8",
    "Region 9",
    "Region 10",
    "Region 11",
    "Region 12",
    "Region 13",
    "BARMM",
    "CAR",
    "NCR",
  ];

  return (
    <div className="mb-3 relative w-full">
      <h3 className="font-semibold text-gray-700 capitalize mb-1">Region</h3>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border rounded bg-white flex justify-between items-center"
      >
        {selectedRegions.length > 0
          ? selectedRegions.join(", ")
          : "Select Regions"}
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto z-50">
          {regions.map((region) => (
            <label
              key={region}
              className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => toggleRegion(region)}
                className="w-4 h-4"
              />
              {region}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Sidebar Component
export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedFilters,
  toggleFilter,
  handleLogout,
}: SidebarProps) {
  // Checkbox filter generator
  const filterButton = (
    category: keyof typeof selectedFilters,
    options: string[]
  ) => (
    <div className="mb-3">
      <h3 className="font-semibold text-gray-700 capitalize mb-1">
        {category}
      </h3>
      <div className="flex flex-col gap-1 ml-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={selectedFilters[category].includes(opt)}
              onChange={() => toggleFilter(category, opt)}
              className="w-4 h-4"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-72 bg-white border-r shadow-sm p-6 flex flex-col justify-between fixed h-screen overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex justify-start items-center gap-3 mb-8">
          <Image
            src="/assets/UgnayPalay_Logo.png"
            alt="PhilRice"
            width={50}
            height={50}
          />
          <h2 className="text-[26px] font-bold text-gray-800">PhilRice R4D</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-2 mb-6">
          <button
            className={`py-2 px-3 rounded text-left ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>

          {/* Filters */}
          {activeTab === "analytics" && (
            <div className="mt-3 space-y-3">
              {filterButton("sex", ["Male", "Female"])}
              {filterButton("age", [
                "30 years old and below",
                "31-45",
                "46-59",
                "60 years old and above",
              ])}
              {filterButton("indigenous", ["Yes", "No"])}
              {filterButton("disability", ["Yes", "No"])}
              <RegionDropdown
                selectedRegions={selectedFilters.region}
                toggleRegion={(region) => toggleFilter("region", region)}
              />
            </div>
          )}

          <button
            className={`py-2 px-3 rounded text-left ${
              activeTab === "participants"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </aside>
  );
}
