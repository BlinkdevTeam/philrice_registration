"use client";

import React from "react";
import PrintIDCard from "./PrintIDCard";
import { WalkinForm } from "../types/walkin";

type ParticipantListProps = {
  filteredParticipants: WalkinForm[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedBatch: WalkinForm[];
  toggleSelect: (p: WalkinForm) => void;
  selected: WalkinForm | null;
  setSelected: (p: WalkinForm | null) => void;
  handlePrint: () => void;
  handleBulkPrint: () => void; // ✅ new prop
  printRef: React.RefObject<HTMLDivElement | null>;
};

export default function ParticipantList({
  filteredParticipants,
  searchTerm,
  setSearchTerm,
  selectedBatch,
  toggleSelect,
  selected,
  setSelected,
  handlePrint,
  handleBulkPrint,
  printRef,
}: ParticipantListProps) {
  return (
    <main className="flex flex-1 overflow-hidden">
      {/* Left section: Table */}
      <section className="w-2/3 p-6 overflow-auto">
        <input
          type="text"
          placeholder="Search name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
        />

        <div className="overflow-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Select</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Sex</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedBatch.some((i) => i.email === p.email)}
                      onChange={() => toggleSelect(p)}
                    />
                  </td>
                  <td className="p-3">{`${p.first_name} ${p.last_name}`}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.sex}</td>
                  <td className="p-3">{p.company_name}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelected(p)}
                      className="text-blue-600 hover:underline"
                    >
                      View ID
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Bulk Print Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleBulkPrint}
            disabled={selectedBatch.length === 0}
            className={`px-4 py-2 rounded text-white ${
              selectedBatch.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Bulk Print Selected ({selectedBatch.length})
          </button>
        </div>
      </section>

      {/* Right section: Print ID preview (only if selected) */}
      {selected && (
        <section className="w-1/3 bg-white flex flex-col items-center justify-center shadow-inner">
          <div ref={printRef}>
            <PrintIDCard participant={selected} />
          </div>
          <button
            onClick={handlePrint}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Print ID
          </button>
        </section>
      )}
    </main>
  );
}
