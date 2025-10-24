import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
