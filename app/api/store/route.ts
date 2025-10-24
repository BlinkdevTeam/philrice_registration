import { NextResponse } from "next/server";

// ⚠️ For development only: ignore self-signed SSL warnings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🔹 Forward request to PHP API endpoint
    const res = await fetch(
      "https://ugnaypalay.philrice.gov.ph:441/csd/37th/api/store",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify(body),
      }
    );

    // ✅ Get raw response text
    const text = await res.text();

    // ❌ If external API fails
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

    // ✅ Try to parse JSON safely
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      console.error("⚠️ Response was not valid JSON:", text);
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
