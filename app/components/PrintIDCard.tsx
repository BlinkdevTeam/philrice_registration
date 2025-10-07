"use client";

type Participant = {
  id: number;
  unique_code: string;
  full_name: string;
  email: string;
  company: string;
  designation: string;
  event_name: string;
};

export default function PrintIDCard({
  participant,
}: {
  participant: Participant;
}) {
  const initials = participant.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      id="id-card"
      className="bg-white shadow-md relative border border-gray-300 print:border-none"
      style={{
        width: "4in",
        height: "5.66in",
        margin: "0 auto",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white h-full p-4">
        {/* Logo Circle */}
        <div className="w-14 h-14 flex items-center justify-center bg-white text-blue-600 font-bold text-lg rounded-full mb-2 border border-white">
          PH
        </div>

        {/* Avatar Circle */}
        <div className="w-24 h-24 flex items-center justify-center bg-yellow-400 text-blue-800 text-3xl font-bold rounded-full border-4 border-white mb-3">
          {initials}
        </div>

        {/* Name & Position */}
        <h2 className="text-xl font-bold uppercase text-center">
          {participant.full_name}
        </h2>
        <p className="text-sm text-center">
          {participant.designation || "Participant"}
        </p>

        {/* ID Number */}
        <div className="mt-3 bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
          ID No: {participant.unique_code}
        </div>

        {/* Footer */}
        <div className="mt-auto mb-2 text-xs text-center text-white opacity-90">
          <p>{participant.company || "PhilRice"}</p>
          <p>{participant.event_name}</p>
        </div>
      </div>
    </div>
  );
}
