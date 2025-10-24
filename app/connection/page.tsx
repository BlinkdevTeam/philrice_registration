// app/page.tsx or wherever you call your proxy
"use client";

export default function TestProxy() {
  const fetchParticipant = async () => {
    try {
      const response = await fetch("/api/check-participant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantId: "118",
        }),
      });

      const data = await response.json();
      console.log("✅ Participant Data:", data);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={fetchParticipant}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Participant via Proxy
      </button>
    </div>
  );
}
