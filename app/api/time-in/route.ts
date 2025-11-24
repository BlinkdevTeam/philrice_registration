export async function POST(req: Request) {
  try {
    const body = await req.json(); // { qrcode: "..." }

    const response = await fetch(
      "https://ugnaypalay.philrice.gov.ph:441/csd/37th/api/check-participant",
      {
        method: "POST",
        headers: {
          "x-api-key": "yDNpoaxodzxNGJPaynIaEb72sGF2GfCX1KmVS",
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Proxy failed", details: `${error}` }),
      { status: 500 }
    );
  }
}
