"use client";

import React from "react";
import Image from "next/image";

type SidebarProps = {
  activeTab: "analytics" | "participants";
  setActiveTab: (tab: "analytics" | "participants") => void;
  handleLogout: () => void;
};

export default function Sidebar({
  activeTab,
  setActiveTab,
  handleLogout,
}: SidebarProps) {
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
