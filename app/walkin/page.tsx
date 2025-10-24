"use client";

import React, { useState } from "react";
import { WalkinForm } from "../types/walkin";

export default function WalkinPage() {
  const [formData, setFormData] = useState<WalkinForm>({
    email: "",
    isPhilriceEmp: "No",
    firstName: "",
    midName: "",
    lastName: "",
    extName: "",
    sex: "",
    ageBracket: "",
    isIndigenous: "No",
    indigenousGroup: "",
    withDisability: "No",
    disability: "",
    contactNo: "",
    philriceName: "",
    philriceStation: "",
    philriceUnit: "",
    affiliationName: "",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    message: string;
    id: number;
    qrdata: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessData(null);

    // ✅ Ensure backend-required fields always exist
    const payload = {
      ...formData,
      philriceName:
        formData.isPhilriceEmp === "Yes"
          ? formData.philriceName
          : formData.affiliationName || "N/A",
      philriceStation:
        formData.isPhilriceEmp === "Yes" ? formData.philriceStation : "N/A",
      philriceUnit:
        formData.isPhilriceEmp === "Yes" ? formData.philriceUnit : "N/A",
    };

    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success) {
        // ✅ Display success message
        setSuccessData({
          message: result.message,
          id: result.id,
          qrdata: result.qrdata,
        });

        // ✅ Reset form
        setFormData({
          email: "",
          isPhilriceEmp: "No",
          firstName: "",
          midName: "",
          lastName: "",
          extName: "",
          sex: "",
          ageBracket: "",
          isIndigenous: "No",
          indigenousGroup: "",
          withDisability: "No",
          disability: "",
          contactNo: "",
          philriceName: "",
          philriceStation: "",
          philriceUnit: "",
          affiliationName: "",
        });
      } else {
        alert(`⚠️ ${result.message || "Validation failed."}`);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Server error. Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Walk-in Registration</h1>

      {/* ✅ Success message */}
      {successData && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded mb-4">
          <p className="font-semibold">{successData.message}</p>
          <p>
            <strong>Participant ID:</strong> {successData.id}
          </p>
          <p>
            <strong>QR Code:</strong> {successData.qrdata}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border p-2 w-full rounded"
        />

        {/* PhilRice Employee or Not */}
        <select
          name="isPhilriceEmp"
          value={formData.isPhilriceEmp}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="No">Non-PhilRice</option>
          <option value="Yes">PhilRice Employee</option>
        </select>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-2">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="border p-2 rounded"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="border p-2 rounded"
          />
        </div>

        {/* Middle and Extension Name */}
        <div className="grid grid-cols-2 gap-2">
          <input
            name="midName"
            value={formData.midName}
            onChange={handleChange}
            placeholder="Middle Name"
            className="border p-2 rounded"
          />
          <input
            name="extName"
            value={formData.extName}
            onChange={handleChange}
            placeholder="Extension (e.g., Jr., Sr.)"
            className="border p-2 rounded"
          />
        </div>

        {/* Sex and Age Bracket */}
        <div className="grid grid-cols-2 gap-2">
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            name="ageBracket"
            value={formData.ageBracket}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Age Bracket</option>
            <option value="18-25">18–25</option>
            <option value="26-35">26–35</option>
            <option value="36-45">36–45</option>
            <option value="46+">46+</option>
          </select>
        </div>

        {/* Indigenous & Disability */}
        <div className="grid grid-cols-2 gap-2">
          <select
            name="isIndigenous"
            value={formData.isIndigenous}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="No">Not Indigenous</option>
            <option value="Yes">Indigenous</option>
          </select>
          <input
            name="indigenousGroup"
            value={formData.indigenousGroup}
            onChange={handleChange}
            placeholder="If Yes, specify group"
            className="border p-2 rounded"
            disabled={formData.isIndigenous === "No"}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            name="withDisability"
            value={formData.withDisability}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="No">No Disability</option>
            <option value="Yes">With Disability</option>
          </select>
          <input
            name="disability"
            value={formData.disability}
            onChange={handleChange}
            placeholder="If Yes, specify"
            className="border p-2 rounded"
            disabled={formData.withDisability === "No"}
          />
        </div>

        {/* Contact Number */}
        <input
          name="contactNo"
          type="tel"
          value={formData.contactNo}
          onChange={handleChange}
          placeholder="Contact Number"
          className="border p-2 w-full rounded"
        />

        {/* PhilRice Details (if employee) */}
        {formData.isPhilriceEmp === "Yes" && (
          <>
            <input
              name="philriceName"
              value={formData.philriceName}
              onChange={handleChange}
              placeholder="PhilRice Employee Name"
              required
              className="border p-2 w-full rounded"
            />
            <input
              name="philriceStation"
              value={formData.philriceStation}
              onChange={handleChange}
              placeholder="PhilRice Station"
              required
              className="border p-2 w-full rounded"
            />
            <input
              name="philriceUnit"
              value={formData.philriceUnit}
              onChange={handleChange}
              placeholder="PhilRice Unit"
              required
              className="border p-2 w-full rounded"
            />
          </>
        )}

        {/* Affiliation Name (if non-PhilRice) */}
        {formData.isPhilriceEmp === "No" && (
          <input
            name="affiliationName"
            value={formData.affiliationName}
            onChange={handleChange}
            placeholder="Affiliation / Organization"
            className="border p-2 w-full rounded"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
