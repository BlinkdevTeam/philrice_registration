"use client";

import React from "react";
import Image from "next/image";
import { WalkinForm } from "../types/walkin";

export default function PrintIDCard({
  participant,
}: {
  participant: WalkinForm;
}) {
  const fullName = `${participant.firstName} ${participant.lastName}`.trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="id-card relative bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-white h-full p-5">
        {/* Logo */}
        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full mb-3 border-2 border-white">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </div>

        {/* Avatar Circle */}
        <div className="w-24 h-24 flex items-center justify-center bg-yellow-400 text-blue-800 text-4xl font-bold rounded-full border-4 border-white mb-3">
          {initials}
        </div>

        {/* Full Name */}
        <h2 className="text-lg font-bold uppercase text-center px-2">
          {fullName}
        </h2>

        {/* Email */}
        <p className="text-xs text-center opacity-90 mt-1 break-all">
          {participant.email}
        </p>

        {/* Sex */}
        <p className="text-xs text-center mt-1 opacity-80">
          {participant.sex || "N/A"}
        </p>

        {/* ID Number */}
        <div className="mt-3 bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          ID No: {participant.unique_code || participant.id || "N/A"}
        </div>

        {/* Footer */}
        <div className="mt-auto mb-2 text-xs text-center text-white opacity-90">
          <p>Walk-in Registration</p>
        </div>
      </div>
    </div>
  );
}
