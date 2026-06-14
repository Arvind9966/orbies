import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

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

const ALL_INTERESTS = [
  "Events",
  "Trips",
  "Communities",
  "Networking",
  "Meet New People",
  "Volunteering",
  "Startup Opportunities",
  "Sports & Fitness",
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#a855f7", "#ef4444", "#84cc16"];

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


  const interestData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const interest of ALL_INTERESTS) {
      counts.set(interest, 0);
    }
    for (const r of rows) {
      const parts = (r.interest || "").split(",").map((s) => s.trim());
      for (const part of parts) {
        if (counts.has(part)) {
          counts.set(part, (counts.get(part) ?? 0) + 1);
        }
      }
    }
    return Array.from(counts.entries())
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count);
  }, [rows]);

  const totalRespondents = rows.length;
  const maxCount = interestData[0]?.count ?? 0;
  const topInterest = interestData[0];

  const downloadExcel = () => {
    const data = rows.map((r) => ({
      Date: new Date(r.created_at).toLocaleString(),
      Name: r.name,
      Mobile: r.mobile,
      City: r.city,
      Interest: r.interest,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 18 }, { wch: 30 }];

    const summary = [
      ["Interest", "Count"],
      ...interestData.map((d) => [d.interest, d.count]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(summary);
    ws2["!cols"] = [{ wch: 30 }, { wch: 10 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Signups");
    XLSX.utils.book_append_sheet(wb, ws2, "Interest Summary");
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `waitlist-signups-${stamp}.xlsx`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Waitlist Entries</h1>
          <button
            onClick={downloadExcel}
            disabled={rows.length === 0}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              fontWeight: 600,
              cursor: rows.length === 0 ? "not-allowed" : "pointer",
              opacity: rows.length === 0 ? 0.5 : 1,
            }}
          >
            ⬇ Download Excel
          </button>
        </div>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          {loading ? "Loading…" : `${rows.length} total`}
        </p>

        {error && (
          <div style={{ background: "#3a1212", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {interestData.length > 0 && (
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Responses by Interest</h2>
              {topInterest && (
                <p style={{ opacity: 0.7, fontSize: 14 }}>
                  Top: <span style={{ color: "#6366f1", fontWeight: 600 }}>{topInterest.interest}</span> ({topInterest.count})
                </p>
              )}
            </div>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={interestData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                  <XAxis dataKey="interest" stroke="#888" tick={{ fontSize: 12, fill: "#bbb" }} interval={0} angle={-25} textAnchor="end" height={70} />
                  <YAxis stroke="#888" allowDecimals={false} tick={{ fontSize: 12, fill: "#bbb" }} />
                  <Tooltip contentStyle={{ background: "#161616", border: "1px solid #333", borderRadius: 8, color: "#fff" }} cursor={{ fill: "rgba(99,102,241,0.1)" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {interestData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
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
