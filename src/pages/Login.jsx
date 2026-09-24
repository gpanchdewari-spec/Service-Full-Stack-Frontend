import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { api, demoMode, errorMessage } from "../api/client";
export default function Login() {
  const { setUser, user } = useApp(),
    navigate = useNavigate(),
    [params] = useSearchParams();
  const [register, setRegister] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const next = params.get("next") === "/cart" ? "/cart" : "/bookings";
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const r = await api.post(
        `/auth/${register ? "register" : "login"}`,
        data,
      );
      setUser(r.data.user);
      navigate(next);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="container page">
      <div className="auth-card">
        <span className="brand-mark mb-6">UC</span>
        <h1>{register ? "Make yourself at home" : "Welcome home"}</h1>
        <p className="muted my-4">
          {register
            ? "Create an account to book your first service."
            : "Sign in to book services and manage your appointments."}
        </p>
        {demoMode ? (
          <>
            <div className="notice mb-6">
              This is an interactive preview. Use a demo profile to try the
              booking flow; no real appointment is scheduled.
            </div>
            <button
              className="button w-full"
              onClick={() => {
                setUser({
                  id: "demo",
                  name: "Demo Customer",
                  role: "customer",
                });
                navigate(next);
              }}
            >
              Continue as demo customer
            </button>
          </>
        ) : (
          <form onSubmit={submit} className="form-stack">
            {register && (
              <label>
                Full name
                <input
                  name="name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  required
                />
              </label>
            )}
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                minLength={8}
                maxLength={100}
                autoComplete={register ? "new-password" : "current-password"}
                required
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button disabled={busy} className="button">
              {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
            </button>
            <button
              type="button"
              className="text-purple-700"
              onClick={() => {
                setRegister(!register);
                setError("");
              }}
            >
              {register
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </button>
          </form>
        )}
        <Link
          to="/services"
          className="block text-center text-sm mt-6 text-gray-500"
        >
          Continue exploring services
        </Link>
      </div>
    </main>
  );
}
