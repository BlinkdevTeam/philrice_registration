"use client";

import React, { useState } from "react";
import { WalkinForm } from "../types/walkin";
import Image from "next/image";

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

    // ✅ Allow only digits for contact number
    if (name === "contactNo") {
      const numericValue = value.replace(/\D/g, ""); // remove all non-numeric characters
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

      // if (result.success) {
      //   setSuccessData({
      //     message: result.message,
      //     id: result.id,
      //     qrdata: result.qrdata,
      //   });

      //   setFormData({
      //     email: "",
      //     isPhilriceEmp: "No",
      //     firstName: "",
      //     midName: "",
      //     lastName: "",
      //     extName: "",
      //     sex: "",
      //     ageBracket: "",
      //     isIndigenous: "No",
      //     indigenousGroup: "",
      //     withDisability: "No",
      //     disability: "",
      //     contactNo: "",
      //     philriceName: "",
      //     philriceStation: "",
      //     philriceUnit: "",
      //     affiliationName: "",
      //   });
      // }

      if (result.success) {
        // Redirect to QR ID generator
        window.location.href = `https://ugnaypalay.philrice.gov.ph:441/csd/37th/generate-id/${result.qrdata}`;

        return; // stop execution
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
    <>
      {/* ✅ Success Modal */}
      {successData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative">
            <h2 className="text-xl font-bold text-[#007831] mb-3">
              Registration Successful!
            </h2>

            <p className="text-gray-700 mb-1">{successData.message}</p>

            <p className="text-sm text-gray-600">
              <strong>Participant ID:</strong> {successData.id}
            </p>

            {/* QR CODE IMAGE */}
            <div className="flex flex-col items-center gap-2 mb-4 mt-3">
              <strong className="text-sm text-gray-600">QR Code:</strong>

              {successData.qrdata.startsWith("data:image") ? (
                <Image
                  src={successData.qrdata}
                  alt="QR Code"
                  width={180}
                  height={180}
                  className="border border-gray-300 rounded p-1"
                />
              ) : (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    successData.qrdata
                  )}`}
                  alt="QR Code"
                  className="border border-gray-300 rounded p-1"
                />
              )}
            </div>

            <button
              onClick={() => setSuccessData(null)}
              className="bg-[#007831] text-white px-4 py-2 rounded hover:bg-[#00642a] w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/assets/4886408.jpg')" }}
        ></div>
        <div className="relative z-10 bg-white grid grid-cols-1 lg:grid-cols-2 max-w-[1000px] w-full h-full mx-auto shadow-2xl rounded-2xl overflow-hidden">
          {/* LEFT COLUMN - FORM */}
          <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
            <h1 className="text-[28px] sm:text-[36px] font-bold text-[#006872]">
              REGISTER
            </h1>
            <p className="uppercase text-[11px] sm:text-[12px] text-[#F58A1F] mb-2">
              Welcome to PhilRice 37
              <sup className="align-super lowercase text-[6px]">th</sup> UGNAY
              PALAY
            </p>

            {/* 🧾 FORM START */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 mt-2 sm:mt-4 text-sm sm:text-base text-black"
            >
              {/* Email */}
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="border border-[#d4d4d4] p-2 w-full rounded"
              />

              {/* Contact Number */}
              <input
                name="contactNo"
                type="tel"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="Contact Number"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                className="border border-[#d4d4d4] p-2 w-full rounded"
              />

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="border border-[#d4d4d4] p-2 rounded"
                />
                <input
                  name="midName"
                  value={formData.midName}
                  onChange={handleChange}
                  placeholder="Middle Name"
                  className="border border-[#d4d4d4] p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="border border-[#d4d4d4] p-2 rounded"
                />
                <input
                  name="extName"
                  value={formData.extName}
                  onChange={handleChange}
                  placeholder="Extension (e.g., Jr., Sr.)"
                  className="border border-[#d4d4d4] p-2 rounded"
                />
              </div>

              {/* Sex and Age Bracket */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 border border-[#d4d4d4] p-2 rounded">
                  <label className="font-medium">Sex:</label>
                  <div className="flex space-x-3 mt-2 sm:mt-0">
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        name="sex"
                        value="Male"
                        checked={formData.sex === "Male"}
                        onChange={handleChange}
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        name="sex"
                        value="Female"
                        checked={formData.sex === "Female"}
                        onChange={handleChange}
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <select
                  name="ageBracket"
                  value={formData.ageBracket}
                  onChange={handleChange}
                  className="border border-[#d4d4d4] p-2 rounded w-full"
                >
                  <option value="">Select Age Bracket</option>
                  <option value="30 y/o and below">30 y/o and below</option>
                  <option value="31-45 y/o">31-45 y/o</option>
                  <option value="46-59 y/o">46-59 y/o</option>
                  <option value="60 y/o and above">60 y/o and above</option>
                </select>
              </div>

              {/* Affiliation / Organization */}
              <input
                name="affiliationName"
                value={formData.affiliationName}
                onChange={handleChange}
                placeholder="Affiliation / Organization"
                className="border border-[#d4d4d4] p-2 w-full rounded"
              />

              {/* Indigenous */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  name="isIndigenous"
                  value={formData.isIndigenous}
                  onChange={handleChange}
                  className="border border-[#d4d4d4] p-2 rounded"
                >
                  <option value="No">Not Indigenous</option>
                  <option value="Yes">Indigenous</option>
                </select>

                {formData.isIndigenous === "Yes" && (
                  <input
                    name="indigenousGroup"
                    value={formData.indigenousGroup}
                    onChange={handleChange}
                    placeholder="Specify Tribe"
                    className="border border-[#d4d4d4] p-2 rounded"
                  />
                )}
              </div>

              {/* Disability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  name="withDisability"
                  value={formData.withDisability}
                  onChange={handleChange}
                  className="border border-[#d4d4d4] p-2 rounded"
                >
                  <option value="No">No Disability</option>
                  <option value="Yes">With Disability</option>
                </select>

                {formData.withDisability === "Yes" && (
                  <input
                    name="disability"
                    value={formData.disability}
                    onChange={handleChange}
                    placeholder="Specify Disability"
                    className="border border-[#d4d4d4] p-2 rounded"
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#007831] text-white px-4 py-2 rounded w-full hover:bg-[#00642a] disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN - IMAGE */}
          <div className="hidden lg:flex items-center justify-center relative w-full h-64 lg:h-auto overflow-hidden ">
            <Image
              src="/assets/COVER.jpg"
              alt="40 years rice art"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex lg:hidden">
            <Image
              src="/assets/COVER.jpg"
              alt="40 years rice art"
              width={1000}
              height={0}
              // className="w-[1000px] h-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
}
