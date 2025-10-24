"use client";

type Props = {
  total: number;
};

export default function ParticipantStats({ total }: Props) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6 text-center border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Total Participants
        </h2>
        <p className="text-5xl font-bold text-blue-600 mb-3">{total}</p>
      </div>
    </div>
  );
}
