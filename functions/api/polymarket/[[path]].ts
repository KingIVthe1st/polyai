/**
 * Cloudflare Pages Function to proxy Polymarket API requests
 * This handles CORS and forwards requests to the Polymarket Gamma API
 */

const GAMMA_API_URL = "https://gamma-api.polymarket.com";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestGet: PagesFunction = async (context) => {
  try {
    // Get the path after /api/polymarket/
    const url = new URL(context.request.url);
    const pathParts = url.pathname.replace("/api/polymarket/", "");

    // Build the target URL
    const targetUrl = `${GAMMA_API_URL}/${pathParts}${url.search}`;

    // Forward the request to Polymarket API
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "PolyAI/1.0",
      },
    });

    // Get the response body
    const data = await response.text();

    // Return the response with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Polymarket API" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
};
