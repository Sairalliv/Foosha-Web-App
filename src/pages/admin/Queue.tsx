import { useEffect, useState } from "react";
import { listUnmatchedDonations, listUnmatchedRequests, confirmMatch } from "../../data/api";
import type { Donation, HelpRequest } from "../../data/types";
import { LoadingState, EmptyState } from "../../components/Shared";

export default function AdminQueue() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [justMatched, setJustMatched] = useState<string | null>(null);

  async function refresh() {
    const [d, r] = await Promise.all([listUnmatchedDonations(), listUnmatchedRequests()]);
    setDonations(d);
    setRequests(r);
    setSelectedDonation(d[0] ?? null);
    setSelectedRequest(r[0] ?? null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleConfirmMatch() {
    if (!selectedDonation || !selectedRequest) return;
    setConfirming(true);
    const ticket = await confirmMatch(selectedDonation.id, selectedRequest.id);
    setJustMatched(ticket.id);
    setConfirming(false);
    await refresh();
    setTimeout(() => setJustMatched(null), 3000);
  }

  if (loading) return <LoadingState />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Matching queue</div>
          <h1>Match donations to requests</h1>
          <p className="sub">
            Pick one from each side, then confirm — this issues a real match ticket with a one-time pickup code.
          </p>
        </div>
      </div>

      {justMatched && (
        <div className="priority-banner">
          <span className="tag-dot" />
          Match confirmed — ticket #{justMatched} created with a pickup code.
        </div>
      )}

      <div className="queue-cols">
        <div>
          <div className="queue-col-head"><h3>Pending donations</h3><span>{donations.length} unmatched</span></div>
          {donations.length === 0 ? (
            <EmptyState label="No pending donations." />
          ) : (
            donations.map((d) => (
              <div
                className={`queue-item${selectedDonation?.id === d.id ? " selected" : ""}`}
                key={d.id}
                onClick={() => setSelectedDonation(d)}
                style={{ cursor: "pointer" }}
              >
                <div className="nm">{d.description}</div>
                <div className="meta">from {d.donorName} · Barangay {d.barangay}</div>
              </div>
            ))
          )}
        </div>
        <div>
          <div className="queue-col-head"><h3>Pending requests</h3><span>{requests.length} waiting</span></div>
          {requests.length === 0 ? (
            <EmptyState label="No pending requests." />
          ) : (
            requests.map((r) => (
              <div
                className={`queue-item${selectedRequest?.id === r.id ? " selected" : ""}`}
                key={r.id}
                onClick={() => setSelectedRequest(r)}
                style={{ cursor: "pointer" }}
              >
                <div className="nm">{r.recipientName}</div>
                <div className="meta">Needs {r.description} · {r.priorityTier !== "general" ? r.priorityTier.toUpperCase() + " · Tier 1" : "General"}</div>
              </div>
            ))
          )}
        </div>

        {selectedDonation && selectedRequest && (
          <>
            <div className="match-arrow">SELECTED PAIR — READY TO CONFIRM</div>
            <div className="queue-item selected">
              <div className="nm">{selectedDonation.description}</div>
              <div className="meta">from {selectedDonation.donorName}</div>
            </div>
            <div className="queue-item selected">
              <div className="nm">{selectedRequest.recipientName}</div>
              <div className="meta">{selectedRequest.priorityTier !== "general" ? selectedRequest.priorityTier.toUpperCase() + " · Tier 1" : "General"}</div>
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={handleConfirmMatch} disabled={confirming}>
                {confirming ? "Confirming…" : "Confirm this match"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
