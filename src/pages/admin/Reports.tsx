import { useEffect, useState } from "react";
import { getAnalyticsSnapshot } from "../../data/api";
import type { AnalyticsSnapshot } from "../../data/types";
import { LoadingState } from "../../components/Shared";

export default function AdminReports() {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);

  useEffect(() => {
    getAnalyticsSnapshot().then(setSnapshot);
  }, []);

  if (!snapshot) return <LoadingState />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Reports &amp; impact</div>
          <h1>City impact report</h1>
          <p className="sub">Pull a snapshot of the network's impact for any date range or barangay.</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>Export as PDF</button>
      </div>

      <div className="filter-bar">
        <select><option>Last 30 days</option><option>This quarter</option><option>Year to date</option></select>
        <select><option>All barangays</option><option>Basak</option><option>Tipolo</option><option>Subangdaku</option></select>
        <select><option>Food + cash</option><option>Food only</option><option>Cash only</option></select>
      </div>

      <div className="stat-row">
        <div className="stat-card"><div className="num">{snapshot.householdsHelped}</div><div className="lbl">Households helped</div></div>
        <div className="stat-card"><div className="num">₱{(snapshot.totalValuePhp / 1000).toFixed(0)}K</div><div className="lbl">Total value distributed</div></div>
        <div className="stat-card"><div className="num">{snapshot.avgMatchTimeHours}h</div><div className="lbl">Avg. time to match</div></div>
        <div className="stat-card"><div className="num">{snapshot.confirmedWithin24hPct}%</div><div className="lbl">Confirmation rate</div></div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Donations matched per week</h3></div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 160, padding: "16px 0" }}>
          {[55, 72, 64, 90, 100].map((h, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  height: `${h}%`,
                  borderRadius: "6px 6px 0 0",
                  background: i === 4 ? "linear-gradient(180deg, var(--jeepney), var(--jeepney-dark))" : "linear-gradient(180deg, var(--kalamansi), #a9c23e)",
                }}
              />
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--paper-dim)", marginTop: 8, fontFamily: "var(--font-mono)" }}>
                Wk {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
