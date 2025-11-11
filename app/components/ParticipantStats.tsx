"use client";

type Props = {
  total: number;
};

export default function ParticipantStats({ total }: Props) {
  return (
    <div className="p-6">
      <div className="">
        <p className="text-[32px] font-semibold text-[#FFFFFF] mb-2">
          Total Participants
        </p>
        <h2 className="text-[72px] font-bold text-[#FFFFFF] mb-3">{total}</h2>
      </div>
    </div>
  );
}
