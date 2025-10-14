"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PrintIDCard from "../components/PrintIDCard";
import { saveAs } from "file-saver";
import "../globals.css";

type Walkin = {
  id: number;
  unique_serial_code: string;
  first_name: string;
  last_name: string;
  email: string;
  sex: string;
  company_name: string;
  inserted_at: string;
};

export default function DashboardPage() {
  const [participants, setParticipants] = useState<Walkin[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Walkin[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Walkin | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Walkin[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // ✅ Fetch participants from new table
  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("philrice_walkin_registration")
        .select("*")
        .order("inserted_at", { ascending: false });

      if (!error && data) {
        setParticipants(data as Walkin[]);
        setFilteredParticipants(data as Walkin[]);
      } else if (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchParticipants();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = participants.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      return (
        fullName.includes(lower) ||
        p.email.toLowerCase().includes(lower) ||
        p.company_name?.toLowerCase().includes(lower)
      );
    });
    setFilteredParticipants(filtered);
  }, [searchTerm, participants]);

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
      ["Full Name", "Email", "Sex", "Company", "Inserted At"],
      ...filteredParticipants.map((p) => [
        `"${p.first_name} ${p.last_name}"`,
        `"${p.email}"`,
        `"${p.sex}"`,
        `"${p.company_name}"`,
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

  const handleSelectParticipant = (p: Walkin) => {
    setSelected(p);
    setIsDrawerOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-30">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Walk-in Dashboard
        </h1>
        <div className="flex flex-wrap gap-2">
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
        <section className="w-full md:w-1/2 p-4 md:p-6 overflow-hidden print:hidden">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-3 text-gray-700 text-sm">
              Total Participants:{" "}
              <span className="font-semibold text-blue-700">
                {filteredParticipants.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-auto max-h-[calc(100vh-230px)]">
            <div className="min-w-[800px]">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <th className="p-3 text-left">Select</th>
                    <th className="p-3 text-left">Full Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Sex</th>
                    <th className="p-3 text-left">Company</th>
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
                        <td className="p-3">{`${p.first_name} ${p.last_name}`}</td>
                        <td className="p-3">{p.email}</td>
                        <td className="p-3">{p.sex}</td>
                        <td className="p-3">{p.company_name}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleSelectParticipant(p)}
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
                        colSpan={6}
                        className="text-center text-gray-500 py-6 font-medium"
                      >
                        No participants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right Panel (Desktop) */}
        <section className="hidden md:flex w-1/2 flex-col items-center justify-center p-8 bg-white shadow-inner">
          {selected ? (
            <>
              <div ref={printRef}>
                <PrintIDCard
                  participant={{
                    id: selected.id,
                    unique_code: selected.unique_serial_code,
                    first_name: selected.first_name,
                    last_name: selected.last_name,
                    email: selected.email,
                    sex: selected.sex,
                    company_name: selected.company_name,
                  }}
                />
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

        {/* Hidden Batch Print Section */}
        <div className="hidden">
          <div ref={batchPrintRef}>
            {selectedBatch.map((p) => (
              <div key={p.id} className="page-break id-card">
                <PrintIDCard
                  participant={{
                    id: p.id,
                    unique_code: p.unique_serial_code,
                    first_name: p.first_name,
                    last_name: p.last_name,
                    email: p.email,
                    sex: p.sex,
                    company_name: p.company_name,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
