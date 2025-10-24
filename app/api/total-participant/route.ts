import { NextResponse } from "next/server";

type Participant = {
  id?: string;
  sex?: string;
  isIndigenous?: string;
  withDisability?: string;
  ageBracket?: string;
  [key: string]: unknown;
};

type APIResponse = {
  success: boolean;
  data?: Participant[];
  message?: string;
};

export async function GET() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/get-participant`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    // Allow self-signed SSL (for dev environments)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // ✅ Fetch male participants
    const maleBody = new URLSearchParams({ sex: "male" }).toString();
    const maleRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-key": apiKey || "",
      },
      body: maleBody,
      cache: "no-store",
    });

    const maleData: APIResponse = await maleRes.json();
    const males = maleData.success && Array.isArray(maleData.data) ? maleData.data : [];

    // ✅ Fetch female participants
    const femaleBody = new URLSearchParams({ sex: "female" }).toString();
    const femaleRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-key": apiKey || "",
      },
      body: femaleBody,
      cache: "no-store",
    });

    const femaleData: APIResponse = await femaleRes.json();
    const females = femaleData.success && Array.isArray(femaleData.data) ? femaleData.data : [];

    // ✅ Combine both male and female participants
    const allParticipants = [...males, ...females];

    // ✅ Count male, female, and total
    const maleCount = males.length;
    const femaleCount = females.length;
    const total = maleCount + femaleCount;

    // ✅ Count Indigenous (Yes / No)
    const indigenousYes = allParticipants.filter(
      (p) => String(p.isIndigenous).toLowerCase() === "yes"
    ).length;
    const indigenousNo = allParticipants.filter(
      (p) => String(p.isIndigenous).toLowerCase() === "no"
    ).length;

    // ✅ Count With Disability (Yes / No)
    const disabilityYes = allParticipants.filter(
      (p) => String(p.withDisability).toLowerCase() === "yes"
    ).length;
    const disabilityNo = allParticipants.filter(
      (p) => String(p.withDisability).toLowerCase() === "no"
    ).length;

    // ✅ Count Age Bracket occurrences dynamically
    const ageBracketCounts: Record<string, number> = {};
    allParticipants.forEach((p) => {
      const bracket = p.ageBracket?.trim() || "Unknown";
      ageBracketCounts[bracket] = (ageBracketCounts[bracket] || 0) + 1;
    });

    // ✅ Return all computed values
    return NextResponse.json({
      success: true,
      maleCount,
      femaleCount,
      total,
      indigenousYes,
      indigenousNo,
      disabilityYes,
      disabilityNo,
      ageBracketCounts, // ✅ new data
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: "An unknown error occurred." },
      { status: 500 }
    );
  }
}
