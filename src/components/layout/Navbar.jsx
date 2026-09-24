import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { api, errorMessage } from "../../api/client";
import Modal from "../ui/Modal";

export default function Navbar() {
  const { city, setCity, pinCode, setPinCode, cart, user, signOut } = useApp();

  const [locationOpen, setLocationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [enteredPin, setEnteredPin] = useState(pinCode);
  const [pinError, setPinError] = useState("");
  const [checkingPin, setCheckingPin] = useState(false);

  const navigate = useNavigate();

  function search(event) {
    event.preventDefault();
    navigate(`/services?q=${encodeURIComponent(query)}`);
  }

  function openLocation() {
    setEnteredPin(pinCode);
    setPinError("");
    setLocationOpen(true);
  }

  async function checkLocation(event) {
    event.preventDefault();
    setPinError("");
    setCheckingPin(true);

    try {
      const response = await api.get(`/service-area/${enteredPin.trim()}`);

      if (!response.data.available) {
        setPinError(response.data.message);
        return;
      }

      setPinCode(response.data.pinCode);
      setCity(response.data.city);
      setLocationOpen(false);
    } catch (error) {
      setPinError(errorMessage(error));
    } finally {
      setCheckingPin(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav-inner">
          <Link
            to="/"
            aria-label="HomeSaathi home"
            className="inline-flex h-11 shrink-0 items-center"
          >
            <img
              src="/assets/homesaathi-icon.png"
              alt=""
              className="block! h-10 w-10 object-contain sm:hidden!"
            />

            <img
              src="/assets/homesaathi-logo.png"
              alt="HomeSaathi"
              className="hidden! h-14 w-auto max-w-[285px] object-contain sm:block!"
            />
          </Link>

          <nav className="desktop-nav">
            <Link to="/services?category=painting">Home upgrades</Link>
            <Link to="/services?category=women">Beauty</Link>
          </nav>

          <button
            className="location-button"
            onClick={openLocation}
            type="button"
          >
            <MapPin size={20} />
            <span>
              {pinCode ? `${city} · ${pinCode}` : "Select PIN code"}
              <small>Check service availability</small>
            </span>
            <ChevronDown size={16} />
          </button>

          <form className="search-box" onSubmit={search}>
            <Search size={20} />
            <input
              aria-label="Search for services"
              placeholder="Search for services"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          <Link
            className="icon-button cart-icon"
            to="/cart"
            aria-label={`Cart, ${cart.reduce(
              (sum, item) => sum + item.quantity,
              0,
            )} items`}
          >
            <ShoppingCart size={23} />

            {cart.length > 0 && (
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            )}
          </Link>

          <button
            className="icon-button"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            <UserRound size={23} />
          </button>

          {menuOpen && (
            <div className="account-menu">
              {user ? (
                <>
                  <p className="font-semibold">Hi, {user.name}</p>

                  <Link to="/bookings" onClick={() => setMenuOpen(false)}>
                    My bookings
                  </Link>

                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)}>
                      Admin dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login / Sign up
                </Link>
              )}

              <Link to="/services" onClick={() => setMenuOpen(false)}>
                All services
              </Link>
            </div>
          )}
        </div>
      </header>

      {locationOpen && (
        <Modal
          title="Check service availability"
          onClose={() => setLocationOpen(false)}
        >
          <form onSubmit={checkLocation} className="form-stack">
            <label>
              Your 6-digit PIN code
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={enteredPin}
                onChange={(event) =>
                  setEnteredPin(event.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter PIN code"
                required
              />
            </label>

            {pinError && (
              <p className="error" role="alert">
                {pinError}
              </p>
            )}

            <button className="button" type="submit" disabled={checkingPin}>
              {checkingPin ? "Checking…" : "Check availability"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
