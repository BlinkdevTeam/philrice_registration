import { NextResponse } from "next/server";

// ⚠️ Ignore SSL issues only for development/testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(
      "https://ugnaypalay.philrice.gov.ph:441/csd/37th/api/getParticipants",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await res.text();

    if (!res.ok) {
      console.error("❌ External API Error:", res.status, text);
      return NextResponse.json(
        {
          success: false,
          status: res.status,
          message: `API Error: ${res.statusText}`,
          rawResponse: text,
        },
        { status: res.status }
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error("⚠️ Response was not JSON:", text);
      return NextResponse.json({
        success: false,
        message: "Response is not valid JSON.",
        rawResponse: text,
      });
    }
  } catch (error) {
    console.error("❌ Proxy API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error.",
      },
      { status: 500 }
    );
  }
}
