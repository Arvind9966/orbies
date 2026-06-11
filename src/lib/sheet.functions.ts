import { createServerFn } from "@tanstack/react-start";

const SHEET_ID = "1c5wRGR9dqIaJQaLQzhGN5v2P071NGGZsxRavsauHx-s";
const RANGE = "Sheet1!A:E";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

type Signup = {
  name: string;
  mobile: string;
  city: string;
  interest: string;
};

function clean(s: unknown, max = 200) {
  return String(s ?? "").trim().slice(0, max);
}

export const appendSignupToSheet = createServerFn({ method: "POST" })
  .inputValidator((data: Signup) => ({
    name: clean(data.name, 100),
    mobile: clean(data.mobile, 20),
    city: clean(data.city, 100),
    interest: clean(data.interest, 50),
  }))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!lovableKey || !sheetsKey) {
      throw new Error("Sheets connector not configured");
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
      throw new Error(`Sheets append failed (${res.status}): ${text}`);
    }
    return { ok: true };
  });
