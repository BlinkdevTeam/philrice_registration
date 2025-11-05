"use client";

import { useEffect, useRef, useState } from "react";
import "../globals.css";
import Sidebar from "../components/Sidebar";
import ParticipantStats from "../components/ParticipantStats";
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

  // ✅ Fetch total participants
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

  // ✅ Fetch all participants
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch("/api/participants", { cache: "no-store" });
        const json = await res.json();

        if (Array.isArray(json)) {
          setParticipants(json);
          setFilteredParticipants(json);
        } else if (json.success && Array.isArray(json.data)) {
          setParticipants(json.data);
          setFilteredParticipants(json.data);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, []);

  // ✅ Search handler
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

  // ✅ Print handler (only ID area will print)
  const handlePrint = () => {
    window.print();
  };

  // ✅ Render
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col ml-72">
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {activeTab === "analytics" ? "Analytics Overview" : "Participants"}
          </h1>
        </header>

        {loading ? (
          <p className="p-6 text-gray-600">Loading...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : (
          <div className="p-6 space-y-6">
            {activeTab === "analytics" ? (
              <>
                <ParticipantStats total={total} />
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
          </div>
        )}
      </div>
    </div>
  );
}
