"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ✅ Define a proper type for a record
type WalkinRegistration = {
  id: number;
  full_name: string;
  email: string;
  company: string | null;
  designation: string | null;
  event_name: string;
  created_at: string;
};

export default function WalkinList() {
  const [records, setRecords] = useState<WalkinRegistration[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("philrice_walkin")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching walk-ins:", error);
      } else if (data) {
        setRecords(data as WalkinRegistration[]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Walk-in Participants</h1>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Event</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="text-center border">
              <td className="border p-2">{r.full_name}</td>
              <td className="border p-2">{r.email}</td>
              <td className="border p-2">{r.company ?? "—"}</td>
              <td className="border p-2">{r.event_name}</td>
              <td className="border p-2">
                {new Date(r.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
