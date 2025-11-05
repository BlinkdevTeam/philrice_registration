import { NextResponse } from "next/server";

interface ParticipantSearch {
  email?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
}

export async function POST(req: Request) {
  try {
    const body: ParticipantSearch = await req.json();
    const { email, first_name, middle_name, last_name } = body;

    if (!email && !first_name && !middle_name && !last_name) {
      return NextResponse.json(
        { error: "Missing search parameters" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error("❌ Missing environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const endpoint = `${apiUrl}/get-participant`;

    const backendRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        first_name,
        middle_name,
        last_name,
      }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("❌ Backend error:", backendRes.status, errorText);
      return NextResponse.json(
        { error: "Backend API failed", details: errorText },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("❌ Server crashed in /api/check-participant:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
