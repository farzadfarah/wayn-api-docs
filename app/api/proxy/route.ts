import { NextRequest, NextResponse } from "next/server";

const DEFAULT_TARGET_BASE_URL = "https://api-stg.wayn.ae/api/v1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

async function handleProxy(request: NextRequest) {
  // Extract target URL from headers or query params sent by Scalar
  let targetUrl =
    request.headers.get("scalar-url") ||
    request.headers.get("x-scalar-url") ||
    request.headers.get("target-url") ||
    request.headers.get("x-target-url") ||
    request.headers.get("x-forwarded-url") ||
    request.nextUrl.searchParams.get("url") ||
    request.nextUrl.searchParams.get("target");

  if (!targetUrl) {
    // If no target URL specified, default to staging base URL + path
    const path = request.nextUrl.pathname.replace(/^\/api\/proxy/, "");
    targetUrl = `${DEFAULT_TARGET_BASE_URL}${path}${request.nextUrl.search}`;
  }

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (
      ![
        "host",
        "connection",
        "content-length",
        "accept-encoding",
        "scalar-url",
        "x-scalar-url",
        "target-url",
        "x-target-url",
        "x-forwarded-url",
      ].includes(lowerKey)
    ) {
      headers.set(key, value);
    }
  });

  try {
    const method = request.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "follow",
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        ![
          "content-encoding",
          "content-length",
          "transfer-encoding",
          "access-control-allow-origin",
        ].includes(lowerKey)
      ) {
        responseHeaders.set(key, value);
      }
    });

    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to proxy request", details: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
