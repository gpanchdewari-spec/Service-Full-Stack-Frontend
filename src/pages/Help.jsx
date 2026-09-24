import { Link } from "react-router-dom";
export default function Help() {
  return (
    <main className="container page max-w-3xl">
      <h1>How can we help?</h1>
      <div className="mt-8 space-y-4">
        {[
          [
            "How do I book a service?",
            "Choose your city, browse services, add them to your cart, then sign in and select your address and appointment time.",
          ],
          [
            "When do I pay?",
            "This project supports pay after service. Online payment processing is not enabled.",
          ],
          [
            "Can I cancel a booking?",
            "Yes. Open My bookings and cancel a pending or confirmed appointment. Completed appointments cannot be cancelled.",
          ],
          [
            "Is this the official Urban Company website?",
            "No. This is an independent educational clone. The hosted preview uses demo bookings and does not schedule real professionals.",
          ],
        ].map(([q, a]) => (
          <details key={q} className="panel">
            <summary className="font-semibold cursor-pointer">{q}</summary>
            <p className="muted mt-4">{a}</p>
          </details>
        ))}
      </div>
      <Link className="button mt-8" to="/bookings">
        View my bookings
      </Link>
    </main>
  );
}
