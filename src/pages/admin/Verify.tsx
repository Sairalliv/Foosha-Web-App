import { useEffect, useState } from "react";
import { listVerificationQueue, approveVerification } from "../../data/api";
import type { VerificationCase } from "../../data/types";
import { LoadingState, EmptyState } from "../../components/Shared";

export default function AdminVerify() {
  const [cases, setCases] = useState<VerificationCase[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const c = await listVerificationQueue();
    setCases(c.filter((v) => v.status === "pending"));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleApprove(id: string) {
    await approveVerification(id);
    refresh();
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">People</div>
          <h1>Verification queue</h1>
          <p className="sub">New recipient accounts flagged for eligibility review before they can request assistance.</p>
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <LoadingState />
        ) : cases.length === 0 ? (
          <EmptyState label="Nothing pending review — all caught up." />
        ) : (
          cases.map((v) => (
            <div className="row-item" key={v.id}>
              <div>
                <div className="name">{v.recipientName} — Barangay {v.barangay}</div>
                <div className="meta">
                  {v.documentSubmitted ? `Submitted document · Claims: ${v.claim}` : "No supporting document uploaded yet"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" disabled={!v.documentSubmitted} onClick={() => handleApprove(v.id)}>
                  Approve
                </button>
                <button className="btn btn-ghost btn-sm">Request info</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
