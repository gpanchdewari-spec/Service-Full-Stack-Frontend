import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { api, demoMode, errorMessage } from "../api/client";
import { money } from "../config/site";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Supports existing seed images and uploaded image URLs.
function imageUrl(image) {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) return image;

  if (image.startsWith("/")) {
    const apiBase = new URL(
      api.defaults.baseURL || "/api",
      window.location.origin,
    );

    return new URL(image, apiBase.origin).href;
  }

  return `/assets/${image}`;
}

// Reusable form for both creating and editing a service.
function ServiceForm({ service, categories, busy, onSave, onCancel }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [fileError, setFileError] = useState("");

  const editing = Boolean(service?._id);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectImage(event) {
    const selected = event.target.files?.[0];

    setFile(null);
    setFileError("");

    if (!selected) return;

    if (!IMAGE_TYPES.includes(selected.type)) {
      setFileError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (selected.size > MAX_IMAGE_SIZE) {
      setFileError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setFile(selected);
  }

  function submit(event) {
    event.preventDefault();

    if (busy || fileError) return;

    if (!editing && !file) {
      setFileError("Please select a service image.");
      return;
    }

    const data = new FormData(event.currentTarget);

    // Multipart fields reach Express as strings.
    data.set(
      "active",
      event.currentTarget.elements.active.checked ? "true" : "false",
    );

    // Keep the existing image when no replacement was selected.
    data.delete("image");

    if (file) {
      data.append("image", file);
    }

    onSave(data, service?._id);
  }

  const displayedImage = preview || imageUrl(service?.image);

  return (
    <form onSubmit={submit} className="panel form-stack">
      <h2 className="text-xl font-semibold">
        {editing ? "Edit service" : "Add new service"}
      </h2>

      <fieldset disabled={busy} className="form-stack border-0 p-0 m-0">
        <label>
          Service name
          <input
            name="name"
            defaultValue={service?.name || ""}
            placeholder="Example: Sofa cleaning"
            minLength={2}
            maxLength={120}
            required
          />
        </label>

        <label>
          Category
          <select
            name="category"
            defaultValue={service?.category || ""}
            required
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            Price (₹)
            <input
              name="price"
              type="number"
              min="1"
              max="100000"
              step="1"
              defaultValue={service?.price ?? ""}
              required
            />
          </label>

          <label>
            Duration (minutes)
            <input
              name="duration"
              type="number"
              min="1"
              max="1440"
              step="1"
              defaultValue={service?.duration ?? 60}
              required
            />
          </label>
        </div>

        <label>
          Description
          <textarea
            name="description"
            defaultValue={service?.description || ""}
            placeholder="Explain what this service includes."
            minLength={10}
            maxLength={2000}
            rows={4}
            required
          />
        </label>

        <label>
          {editing ? "Replace service image" : "Service image"}
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={selectImage}
            required={!editing}
          />
        </label>

        <p className="text-sm text-gray-500">
          JPG, PNG, or WebP. Maximum 5 MB.
          {editing && " Leave empty to keep the current image."}
        </p>

        {fileError && (
          <p role="alert" className="error">
            {fileError}
          </p>
        )}

        {displayedImage && (
          <img
            src={displayedImage}
            alt="Service image preview"
            className="w-full h-52 object-cover rounded-xl border border-gray-200"
          />
        )}

        <label className="!flex-row items-center gap-3">
          <input
            name="active"
            type="checkbox"
            className="!w-auto"
            defaultChecked={service?.active ?? true}
          />
          Available for booking
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="button" disabled={!!fileError}>
            {busy ? "Saving…" : editing ? "Save changes" : "Create service"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export default function Admin() {
  const { user, categories } = useApp();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("bookings");

  // null = closed, "new" = create, service object = edit
  const [editor, setEditor] = useState(null);

  async function load() {
    const [bookingResponse, serviceResponse] = await Promise.all([
      api.get("/admin/bookings"),
      api.get("/admin/services"),
    ]);

    setBookings(bookingResponse.data.bookings);
    setServices(serviceResponse.data.services);
  }

  useEffect(() => {
    if (user?.role !== "admin" || demoMode) return;

    let cancelled = false;

    async function initialLoad() {
      setLoading(true);

      try {
        const [bookingResponse, serviceResponse] = await Promise.all([
          api.get("/admin/bookings"),
          api.get("/admin/services"),
        ]);

        if (!cancelled) {
          setBookings(bookingResponse.data.bookings);
          setServices(serviceResponse.data.services);
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  async function updateBooking(id, status) {
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/admin/bookings/${id}`, {
        status,
      });

      setBookings((current) =>
        current.map((booking) =>
          booking._id === id
            ? {
                ...booking,
                status: response.data.booking.status,
              }
            : booking,
        ),
      );

      setSuccess("Booking status updated.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveService(formData, id) {
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      // Axios automatically sets the multipart boundary.
      // Do not manually set Content-Type here.
      const response = id
        ? await api.patch(`/admin/services/${id}`, formData)
        : await api.post("/admin/services", formData);

      const savedService = response.data.service;

      setServices((current) =>
        id
          ? current.map((service) =>
              service._id === id ? savedService : service,
            )
          : [savedService, ...current],
      );

      setEditor(null);
      setSuccess(id ? "Service updated." : "New service added.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function openEditor(value) {
    setError("");
    setSuccess("");
    setEditor(value);
  }

  if (user?.role !== "admin" || demoMode) {
    return (
      <main className="container page">
        <h1>Administrator access</h1>

        <p className="muted my-4">
          {demoMode
            ? "Service uploads require the connected Express backend. Disable demo mode and sign in as an administrator."
            : "Sign in with the administrator account created by your seed script."}
        </p>

        {!demoMode && (
          <Link className="button" to="/login">
            Sign in
          </Link>
        )}
      </main>
    );
  }

  return (
    <main className="container page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1>Manage your services</h1>

        {tab === "services" && !editor && (
          <button
            className="button"
            disabled={busy || loading}
            onClick={() => openEditor("new")}
          >
            + Add service
          </button>
        )}
      </div>

      <div className="filter-chips my-6">
        <button
          className={tab === "bookings" ? "active" : ""}
          disabled={busy}
          onClick={() => setTab("bookings")}
        >
          Bookings ({bookings.length})
        </button>

        <button
          className={tab === "services" ? "active" : ""}
          disabled={busy}
          onClick={() => setTab("services")}
        >
          Services ({services.length})
        </button>
      </div>

      {error && (
        <div className="error mb-5" role="alert">
          {error}
          <button
            type="button"
            className="underline"
            disabled={busy}
            onClick={async () => {
              setError("");
              try {
                await load();
              } catch (err) {
                setError(errorMessage(err));
              }
            }}
          >
            Refresh list
          </button>
        </div>
      )}

      {success && (
        <p className="success mb-5" role="status">
          {success}
        </p>
      )}

      {loading ? (
        <p className="notice">Loading admin panel…</p>
      ) : tab === "bookings" ? (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Appointment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    {booking.user?.name}
                    <small className="block">{booking.phone}</small>
                  </td>

                  <td>{booking.items.map((item) => item.name).join(", ")}</td>

                  <td>
                    {booking.date} {booking.slot}
                    <small className="block">
                      {booking.address}, {booking.city}
                    </small>
                  </td>

                  <td>{money(booking.total)}</td>

                  <td>
                    <select
                      aria-label={`Status for booking ${booking._id}`}
                      disabled={
                        busy ||
                        ["Completed", "Cancelled"].includes(booking.status)
                      }
                      value={booking.status}
                      onChange={(event) =>
                        updateBooking(booking._id, event.target.value)
                      }
                    >
                      <option value={booking.status}>{booking.status}</option>

                      {(booking.status === "Pending"
                        ? ["Confirmed", "Cancelled"]
                        : booking.status === "Confirmed"
                          ? ["Completed", "Cancelled"]
                          : []
                      ).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!bookings.length && <p className="notice">No bookings yet.</p>}
        </div>
      ) : (
        <>
          {editor && (
            <div className="max-w-2xl mb-8">
              <ServiceForm
                key={editor === "new" ? "new" : editor._id}
                service={editor === "new" ? null : editor}
                categories={categories}
                busy={busy}
                onSave={saveService}
                onCancel={() => setEditor(null)}
              />
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <article key={service._id} className="panel">
                {service.image && (
                  <img
                    src={imageUrl(service.image)}
                    alt={service.name}
                    className="w-full h-44 object-cover rounded-lg mb-4"
                  />
                )}

                <h2 className="text-lg font-semibold">{service.name}</h2>

                <p className="muted text-sm mt-2">
                  {categories.find(
                    (category) => category.slug === service.category,
                  )?.name || service.category}
                </p>

                <p className="font-semibold mt-3">
                  {money(service.price)}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    · {service.duration} minutes
                  </span>
                </p>

                <p className="text-sm mt-3">
                  {service.active ? "Available" : "Unavailable"}
                </p>

                <button
                  className="button mt-4"
                  disabled={busy}
                  onClick={() => openEditor(service)}
                >
                  Edit service
                </button>
              </article>
            ))}
          </div>

          {!services.length && !editor && (
            <p className="notice">
              No services yet. Click “Add service” to create one.
            </p>
          )}
        </>
      )}
    </main>
  );
}
