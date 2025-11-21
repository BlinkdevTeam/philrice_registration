"use client";

import { useEffect, useRef, useState } from "react";
import "../globals.css";
import AnalyticsOverview from "../components/AnalyticsOverview";
import ParticipantList from "../components/ParticipantList";
import { WalkinForm } from "../types/walkin";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "participants">(
    "analytics"
  );

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<WalkinForm[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    WalkinForm[]
  >([]);
  const printRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selected, setSelected] = useState<WalkinForm | null>(null);

  // Fetch total participants
  useEffect(() => {
    const fetchTotalParticipants = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/total-participant", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Failed to fetch participants");
        setTotal(data.total || 0);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTotalParticipants();
  }, []);

  // Search handler
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredParticipants(participants);
      return;
    }

    try {
      const res = await fetch("/api/check-participant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: searchTerm.includes("@") ? searchTerm : undefined,
          first_name: !searchTerm.includes("@")
            ? searchTerm.split(" ")[0]
            : undefined,
          last_name: !searchTerm.includes("@")
            ? searchTerm.split(" ")[1]
            : undefined,
        }),
      });

      if (!res.ok) {
        console.error("❌ Search failed", await res.text());
        setFilteredParticipants([]);
        return;
      }

      const data = await res.json();
      const participantsData = Array.isArray(data)
        ? data
        : data.data
        ? data.data
        : [data];

      setFilteredParticipants(participantsData);
    } catch (err) {
      console.error("❌ Search error:", err);
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ✅ Top navigation bar */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/UgnayPalay_Logo.png"
            alt="Ugnay Palay Logo"
            className="h-10 w-auto"
          />
          <h1 className="text-2 xl font-semibold text-[#006872] w-64">
            {activeTab === "analytics" ? "Analytics Overview" : "Participants"}
          </h1>
        </div>

        <div className="bg-white flex items-center gap-4 px-4 py-2 rounded-full">
          {/* Tabs */}
          <button
            className={`px-4 py-2 rounded cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[#F58A1F] text-white rounded-full"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={`px-4 py-2 rounded cursor-pointer ${
              activeTab === "participants"
                ? "bg-[#F58A1F] text-white rounded-full"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
        </div>
        {/* Logout */}
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activeTab === "analytics" ? (
          <>
            {/* <ParticipantStats total={total} /> */}
            <AnalyticsOverview />
          </>
        ) : (
          <ParticipantList
            filteredParticipants={filteredParticipants}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            selected={selected}
            setSelected={setSelected}
            handlePrint={handlePrint}
            printRef={printRef}
          />
        )}
      </main>
    </div>
  );
}
