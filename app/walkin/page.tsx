"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WalkinRegistration() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company: "",
    designation: "",
    event_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("philrice_walkin").insert([form]);

    if (error) {
      console.error(error);
      setMessage("❌ Registration failed. Please try again.");
    } else {
      setMessage("✅ Registration successful!");
      setForm({
        full_name: "",
        email: "",
        company: "",
        designation: "",
        event_name: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-100"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
            PH
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Walk-in Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please fill in the details below
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter full name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              placeholder="Enter company name"
              value={form.company}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              placeholder="Enter designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event
            </label>
            <select
              name="event_name"
              value={form.event_name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Event</option>
              <option value="Day 1 - Conference">Day 1 - Conference</option>
              <option value="Day 2 - Workshop">Day 2 - Workshop</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register Now"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("❌")
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
