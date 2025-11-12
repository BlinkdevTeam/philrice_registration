"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PrintIDCard from "../components/PrintIDCard";

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
  const [selected, setSelected] = useState<Walkin | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("philrice_walkin")
        .select("*")
        .order("inserted_at", { ascending: false });

      if (!error && data) setParticipants(data);
    };

    fetchParticipants();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Table */}
      <div className="w-full md:w-1/2 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Walk-in Dashboard
        </h1>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left text-sm">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Event</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-2">{p.full_name}</td>
                <td className="p-2">{p.email}</td>
                <td className="p-2">{p.event_name}</td>
                <td className="p-2">
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

      {/* Preview */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-white shadow-inner">
        {selected ? (
          <>
            {selected && (
              <PrintIDCard
                participant={{
                  email: selected.email,
                  isPhilriceEmp: "No",
                  firstName: selected.full_name.split(" ")[0] || "",
                  midName: "",
                  lastName:
                    selected.full_name.split(" ").slice(1).join(" ") || "",
                  extName: "",
                  sex: "",
                  ageBracket: "",
                  isIndigenous: "No",
                  indigenousGroup: "",
                  withDisability: "No",
                  disability: "",
                  contactNo: "",
                  id: selected.id,
                  qrdata: selected.unique_code,
                  inserted_at: selected.inserted_at,
                }}
              />
            )}

            <button
              onClick={handlePrint}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print ID
            </button>
          </>
        ) : (
          <p className="text-gray-600">Select a participant to preview ID.</p>
        )}
      </div>
    </div>
  );
}
