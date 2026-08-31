export const corsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-node-key, x-node-sig, x-node-ts",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Max-Age": "86400",
};

export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    headers: { "Content-Type": "application/json", ...corsHeaders },
    status,
  });
}

export function options(): Response {
  return new Response(null, { headers: corsHeaders });
}

export function text(body: string, status = 200): Response {
  return new Response(body, {
    headers: { "Content-Type": "text/plain", ...corsHeaders },
    status,
  });
}
