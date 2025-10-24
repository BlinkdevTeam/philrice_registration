"use client";

import { useEffect, useState } from "react";
import "../globals.css";
import Sidebar from "../components/Sidebar";
import ParticipantStats from "../components/ParticipantStats";
import AnalyticsOverview from "../components/AnalyticsOverview";

export default function DashboardPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    sex: [] as string[],
    age: [] as string[],
    indigenous: [] as string[],
    disability: [] as string[],
    region: [] as string[],
  });

  const toggleFilter = (
    category: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const exists = prev[category].includes(value);
      return {
        ...prev,
        [category]: exists
          ? prev[category].filter((v) => v !== value)
          : [...prev[category], value],
      };
    });
  };

  const [activeTab, setActiveTab] = useState<"analytics" | "participants">(
    "analytics"
  );

  const handleLogout = () => {
    window.location.href = "/login";
  };

  // --- Keep ParticipantStats fetching/logic as before ---
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalParticipants = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/total-participant", {
          cache: "no-store",
        });
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch participants");
        }

        setTotal(data.total || 0);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalParticipants();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col ml-72">
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>

        {loading ? (
          <p className="p-6 text-gray-600">Loading...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : (
          <div className="p-6 space-y-6">
            {/* ✅ Participant summary */}
            <ParticipantStats total={total} />

            {/* ✅ Analytics overview reacts to filters */}
            <AnalyticsOverview selectedFilters={selectedFilters} />
          </div>
        )}
      </div>
    </div>
  );
}
