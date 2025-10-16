"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { WalkinForm } from "../types/walkin"; // ✅ Shared type (create if not yet)

export default function WalkinRegistration() {
  const initialForm: WalkinForm = {
    email: "",
    from_philrice: undefined,
    submitting_paper: undefined,
    joining_tour: undefined,

    first_name: "",
    middle_name: "",
    last_name: "",
    name_extension: "",
    sex: "",
    age_bracket: "",
    contact_number: "",
    indigenous_group: false,
    person_with_disability: false,

    company_name: "",
    company_address: "",
    region: "",
    affiliation_category: "",
    nature_of_work: "",
    designation_position: "",
    company_email_or_website: "",
    company_contact_number: "",

    field_of_specialization: "",
    registration_number: "",
    license_number: "",
    license_expiry_date: "",

    arrival_date: "",
    dietary_restrictions: false,
  };

  const [form, setForm] = useState<WalkinForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /** 🧠 Generic input handler (auto-detects type) */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value === "true"
          ? true
          : value === "false"
          ? false
          : value,
    }));
  };

  /** 🔄 Reset the form */
  const resetForm = () => setForm(initialForm);

  /** 🚀 Submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // ✅ Convert undefined booleans to false for Supabase
    const preparedForm = {
      ...form,
      from_philrice: !!form.from_philrice,
      submitting_paper: !!form.submitting_paper,
      joining_tour: !!form.joining_tour,
      indigenous_group: !!form.indigenous_group,
      person_with_disability: !!form.person_with_disability,
      dietary_restrictions: !!form.dietary_restrictions,
    };

    const { error } = await supabase
      .from("philrice_walkin_registration")
      .insert([preparedForm]);

    if (error) {
      console.error(error);
      setMessage("❌ Registration failed. Please try again.");
    } else {
      setMessage("✅ Registration successful!");
      resetForm();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-blue-100 overflow-y-auto max-h-[90vh]"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
            PH
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            PhilRice Walk-in Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please complete all fields accurately.
          </p>
        </div>

        {/* GENERAL INFORMATION */}
        <section className="space-y-3 mb-6">
          <h2 className="font-semibold text-lg text-blue-700">
            General Information
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["from_philrice", "Are you from PhilRice?"],
              ["submitting_paper", "Will you be submitting a paper?"],
              ["joining_tour", "Joining the DA-PhilRice Tour?"],
            ].map(([name, label]) => (
              <label key={name} className="flex flex-col space-y-1">
                <span className="text-sm text-gray-700">{label}</span>
                <select
                  name={name}
                  value={
                    form[name as keyof WalkinForm] === undefined
                      ? ""
                      : String(form[name as keyof WalkinForm])
                  }
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 text-sm bg-white"
                >
                  <option value="">Select...</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            ))}
          </div>
        </section>

        {/* PERSONAL INFO */}
        <section className="space-y-3 mb-6">
          <h2 className="font-semibold text-lg text-blue-700">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              value={form.middle_name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="name_extension"
              placeholder="Name Extension (e.g., Jr., Sr.)"
              value={form.name_extension}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              name="age_bracket"
              value={form.age_bracket}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Select Age Bracket</option>
              <option value="30 years old and below">
                30 years old and below
              </option>
              <option value="31-45">31–45</option>
              <option value="46-59">46–59</option>
              <option value="60 years old and above">
                60 years old and above
              </option>
            </select>
          </div>

          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            value={form.contact_number}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="indigenous_group"
                checked={form.indigenous_group}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Member of an Indigenous Group?</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="person_with_disability"
                checked={form.person_with_disability}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Person with Disability?</span>
            </label>
          </div>
        </section>

        {/* COMPANY INFO */}
        <section className="space-y-3 mb-6">
          <h2 className="font-semibold text-lg text-blue-700">
            Professional Affiliation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={form.company_name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="company_address"
              placeholder="Company Address"
              value={form.company_address}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Select Region</option>
              {[
                "Region I",
                "Region II",
                "Region III",
                "Region IV-A",
                "Region IV-B",
                "Region V",
                "Region VI",
                "Region VII",
                "Region VIII",
                "Region IX",
                "Region X",
                "Region XI",
                "Region XII",
                "Region XIII",
                "BARMM",
                "CAR",
                "NCR",
              ].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              name="affiliation_category"
              value={form.affiliation_category}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Select Affiliation Category</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Academe">Academe</option>
              <option value="NGO">NGO</option>
              <option value="Individual">Individual</option>
            </select>
          </div>
        </section>

        {/* ARRIVAL & DIETARY */}
        <section className="space-y-3 mb-6">
          <h2 className="font-semibold text-lg text-blue-700">
            Arrival & Dietary Restrictions
          </h2>
          <input
            type="date"
            name="arrival_date"
            value={form.arrival_date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="dietary_restrictions"
              checked={form.dietary_restrictions}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Do you have any dietary restrictions?</span>
          </label>
        </section>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register Now"}
        </button>

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
