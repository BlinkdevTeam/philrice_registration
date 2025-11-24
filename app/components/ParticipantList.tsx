"use client";

import React, { useState } from "react";
import PrintIDCard from "./PrintIDCard";
import { WalkinForm } from "../types/walkin";

type ParticipantListProps = {
  filteredParticipants: WalkinForm[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => Promise<void> | void;
  selected: WalkinForm | null;
  setSelected: (p: WalkinForm | null) => void;
  handlePrint: () => void;
  printRef: React.RefObject<HTMLDivElement | null>;
};

export default function ParticipantList({
  filteredParticipants,
  searchTerm,
  setSearchTerm,
  handleSearch,
  selected,
  setSelected,
  handlePrint,
  printRef,
}: ParticipantListProps) {
  const [loading, setLoading] = useState(false);

  const handleSearchWithLoading = async () => {
    setLoading(true);
    try {
      await handleSearch();
    } finally {
      setLoading(false);
    }
  };

  const handleTimeIn = (qr: any) => {
    console.log("qr", qr)
    const fetchParticipant = async () => {
      try {
        const response = await fetch("/api/time-in", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrcode: qr }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchParticipant();
  };


  return (
    <main className="flex flex-1 overflow-hidden">
      {/* Left section: Table */}
      <section className="w-2/3 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4 gap-2">
          <h1 className="text-xl text-[#F58A1F]">Participant List</h1>
          <div className="flex gap-6">
            <input
              type="text"
              placeholder="Search name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchWithLoading();
                }
              }}
              className="border border-gray-300 rounded-full px-3 py-2 text-sm w-[320px]"
            />
            <button
              onClick={handleSearchWithLoading}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-sm text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#006872] hover:bg-[#00565c]"
              }`}
            >
              {loading ? "Searching..." : "Search Now"}
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Sex</th>
                <th className="p-3 text-center">Action</th>
                <th className="p-3 text-center">Time In</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((p, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-3">{`${p.firstName} ${p.lastName}`}</td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.sex}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelected(p)}
                        className="text-[#F58A1F] hover:underline cursor-pointer"
                      >
                        View ID
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleTimeIn(p.qrdata)}
                        className="text-[#F58A1F] hover:underline cursor-pointer"
                      >
                        Time In
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No participants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Right section: Print ID preview */}
      {selected && (
        <section className="w-1/3 bg-white flex flex-col items-center justify-center shadow-inner py-8">
          <div ref={printRef} className="print-area">
            <PrintIDCard participant={selected} />
          </div>

          <button
            onClick={handlePrint}
            className="mt-6 bg-[#006872] text-white px-6 py-2 rounded hover:bg-[#00565c]"
          >
            Print ID
          </button>
        </section>
      )}
    </main>
  );
}
