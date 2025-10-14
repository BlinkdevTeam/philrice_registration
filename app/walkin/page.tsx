"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type WalkinForm = {
  email: string;
  from_philrice: boolean;
  submitting_paper: boolean;
  joining_tour: boolean;

  first_name: string;
  middle_name: string;
  last_name: string;
  name_extension: string;
  sex: "Male" | "Female" | "";
  age_bracket:
    | ""
    | "30 years old and below"
    | "31-45"
    | "46-59"
    | "60 years old and above";
  contact_number: string;
  indigenous_group: boolean;
  person_with_disability: boolean;

  company_name: string;
  company_address: string;
  region: string;
  affiliation_category: string;
  nature_of_work: string;
  designation_position: string;
  company_email_or_website: string;
  company_contact_number: string;

  field_of_specialization: string;
  registration_number: string;
  license_number: string;
  license_expiry_date: string;

  arrival_date: string;
  dietary_restrictions: boolean;
};

export default function WalkinRegistration() {
  const [form, setForm] = useState<WalkinForm>({
    email: "",
    from_philrice: false,
    submitting_paper: false,
    joining_tour: false,

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
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input and checkbox change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("philrice_walkin_registration")
        .insert([form]);

      if (error) {
        console.error(error);
        setMessage("❌ Registration failed. Please try again.");
      } else {
        setMessage("✅ Registration successful!");
        setForm({
          email: "",
          from_philrice: false,
          submitting_paper: false,
          joining_tour: false,

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
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ An unexpected error occurred.");
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

        {/* EMAIL & BOOLEAN QUESTIONS */}
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
            {(
              [
                ["from_philrice", "Are you from PhilRice?"],
                ["submitting_paper", "Will you be submitting a paper?"],
                ["joining_tour", "Joining the DA-PhilRice Tour?"],
              ] as [keyof WalkinForm, string][]
            ).map(([name, label]) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* PERSONAL INFORMATION */}
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
              <option value="31-45">31-45</option>
              <option value="46-59">46-59</option>
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

        {/* PROFESSIONAL AFFILIATION */}
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
              <option value="Region I">Region I</option>
              <option value="Region II">Region II</option>
              <option value="Region III">Region III</option>
              <option value="Region IV-A">Region IV-A</option>
              <option value="Region IV-B">Region IV-B</option>
              <option value="Region V">Region V</option>
              <option value="Region VI">Region VI</option>
              <option value="Region VII">Region VII</option>
              <option value="Region VIII">Region VIII</option>
              <option value="Region IX">Region IX</option>
              <option value="Region X">Region X</option>
              <option value="Region XI">Region XI</option>
              <option value="Region XII">Region XII</option>
              <option value="Region XIII">Region XIII</option>
              <option value="BARMM">BARMM</option>
              <option value="CAR">CAR</option>
              <option value="NCR">NCR</option>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="nature_of_work"
              placeholder="Nature of Work"
              value={form.nature_of_work}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="designation_position"
              placeholder="Designation / Position"
              value={form.designation_position}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <input
            type="text"
            name="company_email_or_website"
            placeholder="Company Email Address / Website"
            value={form.company_email_or_website}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            name="company_contact_number"
            placeholder="Company Contact Number"
            value={form.company_contact_number}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </section>

        {/* PROFESSIONAL DETAILS */}
        <section className="space-y-3 mb-6">
          <h2 className="font-semibold text-lg text-blue-700">
            Professional Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="field_of_specialization"
              placeholder="Field of Specialization"
              value={form.field_of_specialization}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="registration_number"
              placeholder="Registration Number"
              value={form.registration_number}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="license_number"
              placeholder="License Number"
              value={form.license_number}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              name="license_expiry_date"
              value={form.license_expiry_date}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </section>

        {/* ARRIVAL DETAILS */}
        <section className="space-y-3 mb-6">
          <h2 className="font-semibold text-lg text-blue-700">
            Arrival, Accommodation, and Dietary Restrictions
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
