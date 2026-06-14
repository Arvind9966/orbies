import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Waitlist Entries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Signup = {
  id: string;
  created_at: string;
  name: string;
  mobile: string;
  city: string;
  interest: string;
};

function AdminPage() {
  const [rows, setRows] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("waitlist_signups")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setRows((data as Signup[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Waitlist Entries</h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          {loading ? "Loading…" : `${rows.length} total`}
        </p>

        {error && (
          <div style={{ background: "#3a1212", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ overflowX: "auto", border: "1px solid #222", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead style={{ background: "#161616" }}>
              <tr>
                {["Date", "Name", "Mobile", "City", "Interest"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      borderBottom: "1px solid #222",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap", opacity: 0.8 }}>
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{r.name}</td>
                  <td style={{ padding: "12px 16px" }}>{r.mobile}</td>
                  <td style={{ padding: "12px 16px" }}>{r.city}</td>
                  <td style={{ padding: "12px 16px" }}>{r.interest}</td>
                </tr>
              ))}
              {!loading && rows.length === 0 && !error && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: "center", opacity: 0.6 }}>
                    No entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
