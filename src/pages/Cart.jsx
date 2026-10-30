
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ShieldCheck } from "lucide-react";

import { useApp } from "../context/AppContext";
import { money, asset } from "../config/site";
import { QuantityButton } from "../components/services/ServiceCard";
import { api, demoMode, errorMessage } from "../api/client";
import { slots } from "../../shared/catalog";

export default function Cart() {
  const {
    items,
    total,
    user,
    city,
    setCity,
    pinCode,
    setPinCode,
    clearCart,
  } = useApp();

  const [enteredPin, setEnteredPin] = useState(pinCode || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  // Redirect users to login if they are not authenticated.
  useEffect(() => {
    if (!user) {
      navigate("/login?next=/cart", { replace: true });
    } else {
      setAuthChecked(true);
    }
  }, [user, navigate]);

  const min = new Date(Date.now() + 86400000).toLocaleDateString(
    "en-CA",
    {
      timeZone: "Asia/Kolkata",
    }
  );

  const max = new Date(Date.now() + 29 * 86400000).toLocaleDateString(
    "en-CA",
    {
      timeZone: "Asia/Kolkata",
    }
  );

  async function submit(event) {
    event.preventDefault();

    // Verify the user is logged in before booking.
    if (!user) {
      navigate("/login?next=/cart");
      return;
    }

    // Read form data before any await.
    const fields = Object.fromEntries(
      new FormData(event.currentTarget)
    );

    const selectedPin = enteredPin.trim();

    setError("");
    setBusy(true);

    try {
      // Verify whether the PIN code is serviceable.
      const areaResponse = await api.get(
        `/service-area/${encodeURIComponent(selectedPin)}`
      );

      if (!areaResponse.data.available) {
        setError(
          areaResponse.data.message ||
            "Service is not available at this PIN code."
        );
        return;
      }

      const verifiedCity = areaResponse.data.city;

      setPinCode(selectedPin);
      setCity(verifiedCity);

      const payload = {
        ...fields,
        pinCode: selectedPin,
        city: verifiedCity,
        items: items.map((service) => ({
          slug: service.slug,
          quantity: service.quantity,
        })),
      };

      if (demoMode) {
        // Create a demo booking.
        const booking = {
          ...payload,
          _id: `DEMO-${Date.now()
            .toString(36)
            .toUpperCase()}`,
          items: items.map((service) => ({
            name: service.name,
            price: service.price,
            quantity: service.quantity,
          })),
          total,
          status: "Pending",
          createdAt: new Date().toISOString(),
        };

        let previousBookings = [];

        try {
          previousBookings = JSON.parse(
            sessionStorage.getItem("uc-demo-bookings") || "[]"
          );
        } catch {
          previousBookings = [];
        }

        sessionStorage.setItem(
          "uc-demo-bookings",
          JSON.stringify([booking, ...previousBookings])
        );
      } else {
        // The backend should verify the PIN code again.
        await api.post("/bookings", payload);
      }

      clearCart();
      navigate("/bookings?created=1");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  // Prevent the cart from rendering before authentication is checked.
  if (!authChecked) {
    return null;
  }

  // Display an empty-cart message when there are no items.
  if (!items.length) {
    return (
      <main className="container page empty">
        <ShoppingBag size={54} />

        <h1>Your cart feels a little empty</h1>

        <p>
          Find a service that makes your day easier.
        </p>

        <Link className="button mt-6" to="/services">
          Explore services
        </Link>
      </main>
    );
  }

  return (
    <main className="container page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> / Your cart
      </p>

      <h1>One step closer to a happier home</h1>

      {demoMode && (
        <p className="notice my-5">
          Preview mode · No real service or payment.
        </p>
      )}

      <div className="checkout-grid">
        <form
          id="booking-form"
          onSubmit={submit}
          className="form-stack panel"
        >
          <h2 className="text-2xl font-semibold">
            Your service details
          </h2>

          <label>
            Service PIN code

            <input
              name="pinCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={enteredPin}
              onChange={(event) => {
                setEnteredPin(
                  event.target.value.replace(/\D/g, "")
                );
                setError("");
              }}
              placeholder="Enter your 6-digit PIN code"
              required
            />
          </label>

          {pinCode && enteredPin === pinCode && (
            <p className="text-sm text-gray-600">
              Selected location: {city} · {pinCode}
            </p>
          )}

          <label>
            Complete address

            <textarea
              name="address"
              required
              minLength={10}
              maxLength={500}
              placeholder="House / flat number, building, street and landmark"
            />
          </label>

          <label>
            Mobile number

            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              placeholder="10-digit mobile number"
              required
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-5">
            <label>
              Service date

              <input
                type="date"
                name="date"
                min={min}
                max={max}
                required
              />
            </label>

            <label>
              Arrival slot (IST)

              <select name="slot" required>
                <option value="">Choose a time</option>

                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="notice">
            <ShieldCheck size={20} />
            Pay after service. Additional work is quoted separately.
          </p>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </form>

        <aside className="panel cart-summary">
          <h2 className="text-xl font-semibold mb-5">
            Your cart
          </h2>

          {items.map((service) => (
            <div className="cart-item" key={service.slug}>
              <img src={asset(service.image)} alt="" />

              <div className="flex-1">
                <h3>{service.name}</h3>
                <p>{money(service.price)}</p>
              </div>

              <QuantityButton service={service} />
            </div>
          ))}

          <div className="bill-row">
            <span>Service subtotal</span>
            <span>{money(total)}</span>
          </div>

          <div className="bill-row">
            <span>Booking fee</span>
            <span>₹0</span>
          </div>

          <div className="bill-row bill-total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>

          <button
            type="submit"
            form="booking-form"
            className="button w-full"
            disabled={busy}
          >
            {busy
              ? "Booking…"
              : demoMode
                ? "Create demo booking"
                : "Confirm booking"}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Booking is accepted only for a serviceable PIN code.
          </p>
        </aside>
      </div>
    </main>
  );
}
