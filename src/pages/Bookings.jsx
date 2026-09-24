import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { api, demoMode, errorMessage } from "../api/client";
import { useApp } from "../context/AppContext";
import { money } from "../config/site";
import Modal from "../components/ui/Modal";
export default function Bookings() {
  const { user } = useApp();
  const [bookings, setBookings] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [cancel, setCancel] = useState(null),
    [busy, setBusy] = useState(false),
    [params] = useSearchParams();
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (demoMode) {
      try {
        setBookings(
          JSON.parse(sessionStorage.getItem("uc-demo-bookings") || "[]"),
        );
      } catch {}
      setLoading(false);
    } else
      api
        .get("/bookings")
        .then((r) => setBookings(r.data.bookings))
        .catch((e) => setError(errorMessage(e)))
        .finally(() => setLoading(false));
  }, [user]);
  async function confirmCancel() {
    setBusy(true);
    try {
      if (!demoMode) await api.patch(`/bookings/${cancel}/cancel`);
      setBookings((old) => {
        const updated = old.map((b) =>
          b._id === cancel ? { ...b, status: "Cancelled" } : b,
        );
        if (demoMode)
          sessionStorage.setItem("uc-demo-bookings", JSON.stringify(updated));
        return updated;
      });
      setCancel(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="container page">
      <h1>My bookings</h1>
      <p className="muted mt-3 mb-7">
        A little less to do. A little more time for you.
      </p>
      {params.has("created") && (
        <div className="success mb-6">
          <CheckCircle2 size={20} />
          {demoMode
            ? "Demo booking created. No real appointment was made."
            : "Your booking request is received. You can track its status here."}
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {!user ? (
        <div className="empty">
          <CalendarDays size={44} />
          <h2>Sign in to see your bookings</h2>
          <Link to="/login" className="button mt-5">
            Sign in
          </Link>
        </div>
      ) : loading ? (
        <p>Loading bookings…</p>
      ) : !bookings.length ? (
        <div className="empty">
          <CalendarDays size={44} />
          <h2>Your next helping hand is a tap away</h2>
          <Link className="button mt-5" to="/services">
            Book a service
          </Link>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <article className="panel" key={b._id}>
              <div className="flex justify-between gap-4 flex-wrap">
                <span className="text-sm text-gray-500">
                  Booking #{b._id.slice(-8).toUpperCase()}
                </span>
                <span className={`status status-${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </div>
              <h2 className="text-xl font-semibold mt-4">
                {b.items
                  .map(
                    (i) =>
                      `${i.name}${i.quantity > 1 ? ` × ${i.quantity}` : ""}`,
                  )
                  .join(", ")}
              </h2>
              <p className="my-3">
                {b.date} · {b.slot} IST · {b.city}
              </p>
              <p className="muted">{b.address}</p>
              <div className="flex justify-between items-center mt-5">
                <strong>{money(b.total)} · Pay after service</strong>
                {["Pending", "Confirmed"].includes(b.status) && (
                  <button
                    className="text-red-700 text-sm"
                    onClick={() => setCancel(b._id)}
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {cancel && (
        <Modal
          title="Cancel this booking?"
          onClose={() => !busy && setCancel(null)}
        >
          <p className="muted mb-6">
            The selected appointment will be cancelled.
          </p>
          <button
            disabled={busy}
            className="button w-full"
            onClick={confirmCancel}
          >
            {busy ? "Cancelling…" : "Yes, cancel booking"}
          </button>
        </Modal>
      )}
    </main>
  );
}
