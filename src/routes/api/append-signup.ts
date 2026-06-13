import { createFileRoute } from "@tanstack/react-router";

const SHEET_ID = "1c5wRGR9dqIaJQaLQzhGN5v2P071NGGZsxRavsauHx-s";
const RANGE = "Sheet1!A:E";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

function clean(s: unknown, max = 200) {
  return String(s ?? "").trim().slice(0, max);
}

export const Route = createFileRoute("/api/append-signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.json().catch(() => ({}));
          const data = {
            name: clean(raw?.name, 100),
            mobile: clean(raw?.mobile, 20),
            city: clean(raw?.city, 100),
            interest: clean(raw?.interest, 500),
          };

          const lovableKey = process.env.LOVABLE_API_KEY;
          const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
          if (!lovableKey || !sheetsKey) {
            console.error("[append-signup] Missing connector env vars", {
              hasLovable: !!lovableKey,
              hasSheets: !!sheetsKey,
            });
            return Response.json(
              { ok: false, error: "Sheets connector not configured" },
              { status: 500 },
            );
          }

          const url = `${GATEWAY}/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

          const res = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${lovableKey}`,
              "X-Connection-Api-Key": sheetsKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              range: RANGE,
              majorDimension: "ROWS",
              values: [
                [
                  new Date().toISOString(),
                  data.name,
                  data.mobile,
                  data.city,
                  data.interest,
                ],
              ],
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            console.error("[append-signup] Sheets append failed", res.status, text);
            return Response.json(
              { ok: false, error: `Sheets append failed (${res.status})` },
              { status: 502 },
            );
          }

          return Response.json({ ok: true });
        } catch (e) {
          console.error("[append-signup] unexpected error", e);
          return Response.json(
            { ok: false, error: "Unexpected server error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
