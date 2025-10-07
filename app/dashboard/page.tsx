"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PrintIDCard from "../components/PrintIDCard";
import { saveAs } from "file-saver";
import "../globals.css";

type Walkin = {
  id: number;
  unique_code: string;
  full_name: string;
  email: string;
  company: string;
  designation: string;
  event_name: string;
  inserted_at: string;
};

export default function DashboardPage() {
  const [participants, setParticipants] = useState<Walkin[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Walkin[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [selected, setSelected] = useState<Walkin | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Walkin[]>([]);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const batchPrintRef = useRef<HTMLDivElement>(null);

  // ✅ Session check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.push("/login");
    };
    checkUser();
  }, [router]);

  // ✅ Fetch participants
  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("philrice_walkin")
        .select("*")
        .order("inserted_at", { ascending: false });

      if (!error && data) {
        setParticipants(data);
        setFilteredParticipants(data);
      }
    };
    fetchParticipants();
  }, []);

  // ✅ Unique events
  const uniqueEvents = [
    "All",
    ...new Set(participants.map((p) => p.event_name)),
  ];

  // ✅ Filter logic
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = participants.filter((p) => {
      const matchesSearch =
        p.full_name.toLowerCase().includes(lower) ||
        p.email.toLowerCase().includes(lower);
      const matchesEvent =
        selectedEvent === "All" || p.event_name === selectedEvent;
      return matchesSearch && matchesEvent;
    });
    setFilteredParticipants(filtered);
  }, [searchTerm, selectedEvent, participants]);

  // ✅ Print one ID
  const handlePrint = () => {
    if (printRef.current) {
      const original = document.body.innerHTML;
      document.body.innerHTML = printRef.current.innerHTML;
      window.print();
      document.body.innerHTML = original;
      window.location.reload();
    }
  };

  // ✅ Batch Print
  const handleBatchPrint = () => {
    if (selectedBatch.length === 0)
      return alert("No participants selected for printing.");

    const original = document.body.innerHTML;
    if (batchPrintRef.current) {
      document.body.innerHTML = batchPrintRef.current.innerHTML;
      window.print();
      document.body.innerHTML = original;
      window.location.reload();
    }
  };

  // ✅ Export CSV
  const handleExportCSV = () => {
    if (filteredParticipants.length === 0) return;

    const csvRows = [
      ["Full Name", "Email", "Company", "Designation", "Event", "Inserted At"],
      ...filteredParticipants.map((p) => [
        `"${p.full_name}"`,
        `"${p.email}"`,
        `"${p.company}"`,
        `"${p.designation}"`,
        `"${p.event_name}"`,
        `"${p.inserted_at}"`,
      ]),
    ];

    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "walkin_participants.csv");
  };

  // ✅ Checkbox toggle
  const toggleSelect = (p: Walkin) => {
    setSelectedBatch((prev) =>
      prev.some((item) => item.id === p.id)
        ? prev.filter((item) => item.id !== p.id)
        : [...prev, p]
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Walk-in Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Export CSV
          </button>
          <button
            onClick={handleBatchPrint}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Print Selected IDs
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1">
        {/* Left Panel */}
        <section className="w-full md:w-1/2 p-6 overflow-auto print:hidden">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueEvents.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <th className="p-3 text-left">Select</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p, index) => (
                    <tr
                      key={p.id}
                      className={`border-b hover:bg-blue-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedBatch.some(
                            (item) => item.id === p.id
                          )}
                          onChange={() => toggleSelect(p)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3">{p.full_name}</td>
                      <td className="p-3">{p.email}</td>
                      <td className="p-3">{p.event_name}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelected(p)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View ID
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-500 py-6 font-medium"
                    >
                      No participants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Panel */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white shadow-inner">
          {selected ? (
            <>
              <div ref={printRef}>
                <PrintIDCard participant={selected} />
              </div>
              <button
                onClick={handlePrint}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition print:hidden"
              >
                Print ID
              </button>
            </>
          ) : (
            <p className="text-gray-600 text-sm">
              Select a participant to preview ID.
            </p>
          )}
        </section>
      </main>

      {/* Hidden Batch Print Section */}
      <div className="hidden">
        <div ref={batchPrintRef}>
          {selectedBatch.map((p) => (
            <div key={p.id} className="page-break id-card">
              <PrintIDCard participant={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
