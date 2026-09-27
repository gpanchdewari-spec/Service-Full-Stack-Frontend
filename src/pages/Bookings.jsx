
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  Clock3,
  RefreshCw,
  ReceiptText,
  XCircle,
} from "lucide-react";

import { api, demoMode, errorMessage } from "../api/client";
import { useApp } from "../context/AppContext";
import { money } from "../config/site";
import Modal from "../components/ui/Modal";
import BookingTimeline from "../components/BookingTimeline";

const STATUS_LABELS = {
  Pending: "Booking placed",
  Confirmed: "Confirmed",
  Assigned: "Professional assigned",
  OnTheWay: "Professional on the way",
  InProgress: "Service in progress",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

function getStatusClass(status) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    case "OnTheWay":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "InProgress":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Confirmed":
    case "Assigned":
      return "bg-blue-50 text-blue-700 border-blue-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function BookingCard({ booking, onCancel }) {
  const items = booking.items || [];

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Booking
            </p>

            <p className="mt-1 font-mono text-sm font-bold text-slate-700">
              #{String(booking._id).slice(-8).toUpperCase()}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full border px-3.5 py-1.5 text-xs font-bold ${getStatusClass(
              booking.status,
            )}`}
          >
            <span className="mr-2 h-2 w-2 rounded-full bg-current" />
            {STATUS_LABELS[booking.status] || booking.status}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Services */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Service
          </p>

          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            {items
              .map(
                (item) =>
                  `${item.name}${
                    item.quantity > 1 ? ` × ${item.quantity}` : ""
                  }`,
              )
              .join(", ")}
          </h2>
        </div>

        {/* Appointment information */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
              <CalendarDays size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">
                Appointment
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {booking.date}
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Clock3 size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">
                Time slot
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {booking.slot} IST
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mt-3 flex gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
            <MapPin size={19} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400">
              Service location
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {booking.city}
            </p>

            <p className="mt-0.5 text-sm leading-6 text-slate-500">
              {booking.address}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <BookingTimeline status={booking.status} />

        {/* Footer */}
        <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <ReceiptText size={18} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Total amount
              </p>

              <p className="font-bold text-slate-900">
                {money(booking.total)}
                <span className="ml-1 text-xs font-normal text-slate-500">
                  · Pay after service
                </span>
              </p>
            </div>
          </div>

          {["Pending", "Confirmed"].includes(booking.status) && (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
              onClick={() => onCancel(booking._id)}
            >
              <XCircle size={17} />
              Cancel booking
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Bookings() {
  const { user } = useApp();

  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancel, setCancel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [params] = useSearchParams();

  async function loadBookings(showRefresh = false) {
    if (!user) {
      setLoading(false);
      return;
    }

    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      if (demoMode) {
        try {
          setBookings(
            JSON.parse(
              sessionStorage.getItem("uc-demo-bookings") || "[]",
            ),
          );
        } catch {
          setBookings([]);
        }
      } else {
        const response = await api.get("/bookings");

        setBookings(response.data.bookings || []);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [user]);

  /*
   * Temporary real-time fallback:
   *
   * This polls the backend every 10 seconds.
   * Once Socket.IO is connected, this interval can be removed.
   */
  useEffect(() => {
    if (!user || demoMode) return;

    const interval = setInterval(() => {
      loadBookings(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  async function confirmCancel() {
    setBusy(true);

    try {
      if (!demoMode) {
        await api.patch(`/bookings/${cancel}/cancel`);
      }

      setBookings((old) => {
        const updated = old.map((booking) =>
          booking._id === cancel
            ? { ...booking, status: "Cancelled" }
            : booking,
        );

        if (demoMode) {
          sessionStorage.setItem(
            "uc-demo-bookings",
            JSON.stringify(updated),
          );
        }

        return updated;
      });

      setCancel(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const activeBookings = bookings.filter(
    (booking) => booking.status !== "Completed" && booking.status !== "Cancelled",
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Page header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Your appointments
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              My bookings
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Track your service from booking confirmation to completion.
            </p>
          </div>

          {user && !loading && bookings.length > 0 && (
            <button
              type="button"
              onClick={() => loadBookings(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          )}
        </div>

        {/* Success message */}
        {params.has("created") && (
          <div className="mt-7 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />

            <div>
              <p className="font-bold">Booking received</p>

              <p className="mt-1 text-sm">
                {demoMode
                  ? "Demo booking created. No real appointment was made."
                  : "Your booking request has been received. You can track its status below."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!user ? (
          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Sign in to see your bookings
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Sign in to track appointments, service professionals and booking
              status.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
            >
              Sign in
            </Link>
          </div>
        ) : loading ? (
          <div className="mt-8 space-y-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-[28px] bg-white"
              />
            ))}
          </div>
        ) : !bookings.length ? (
          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your next helping hand is a tap away
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Book a service and track it right here.
            </p>

            <Link
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
              to="/services"
            >
              Book a service
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Active */}
            {activeBookings.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Active bookings
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Live status of your upcoming services.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {activeBookings.length} active
                  </span>
                </div>

                <div className="space-y-5">
                  {activeBookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={setCancel}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {completedBookings.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Completed bookings
                </h2>

                <div className="space-y-5">
                  {completedBookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={setCancel}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancel && (
        <Modal
          title="Cancel this booking?"
          onClose={() => !busy && setCancel(null)}
        >
          <p className="mb-6 text-sm leading-6 text-slate-500">
            The selected appointment will be cancelled. This action cannot be
            undone.
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

