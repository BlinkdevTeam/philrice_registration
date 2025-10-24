import { NextResponse } from "next/server";

type Participant = {
  sex?: string;
  ageBracket?: string;
  participantType?: string;
  dayAttended?: string;
  withDisability?: string;
  isIndigenous?: string;
};

export async function GET() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/allParticipants`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) throw new Error("API URL or API Key not defined");

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-key": apiKey,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const data: Participant[] = await res.json();

    // Initialize per-day summary
    const perDaySummary: Record<
      string,
      {
        total: number;
        sex: { male: number; female: number };
        indigenous: { yes: number; no: number };
        disability: { yes: number; no: number };
        ageBracketCounts: Record<string, number>;
      }
    > = {};

    data.forEach((p) => {
      const day = p.dayAttended?.split(",")[0] || "Unknown";

      if (!perDaySummary[day]) {
        perDaySummary[day] = {
          total: 0,
          sex: { male: 0, female: 0 },
          indigenous: { yes: 0, no: 0 },
          disability: { yes: 0, no: 0 },
          ageBracketCounts: {},
        };
      }

      const summary = perDaySummary[day];

      // Increment total per day
      summary.total += 1;

      // Sex
      const sex = p.sex?.toLowerCase();
      if (sex === "male") summary.sex.male += 1;
      else if (sex === "female") summary.sex.female += 1;

      // Indigenous
      const ind = p.isIndigenous?.toLowerCase();
      if (ind === "yes") summary.indigenous.yes += 1;
      else if (ind === "no") summary.indigenous.no += 1;

      // Disability
      const dis = p.withDisability?.toLowerCase();
      if (dis === "yes") summary.disability.yes += 1;
      else if (dis === "no") summary.disability.no += 1;

      // Age bracket
      const age = p.ageBracket || "Unknown";
      summary.ageBracketCounts[age] = (summary.ageBracketCounts[age] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      total: data.length,
      perDaySummary,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
