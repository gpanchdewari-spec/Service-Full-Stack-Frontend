import { Link, useParams } from "react-router-dom";
import { Star, Check, Clock, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { asset, money } from "../config/site";
import { QuantityButton } from "../components/services/ServiceCard";
export default function ServiceDetails() {
  const { slug } = useParams(),
    { services, loading } = useApp();
  const service = services.find((s) => s.slug === slug);
  if (loading) return <main className="container page">Loading service…</main>;
  if (!service)
    return (
      <main className="container page">
        <h1>Service not found</h1>
        <Link to="/services">Browse services</Link>
      </main>
    );
  return (
    <main className="container page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/services">Services</Link> /{" "}
        {service.name}
      </p>
      <div className="detail-grid">
        <img
          className="detail-image"
          src={asset(service.image)}
          alt={service.name}
        />
        <div>
          <p className="eyebrow">EXPERT CARE, AT HOME</p>
          <h1>{service.name}</h1>
          <p className="rating my-5">
            <Star size={16} fill="currentColor" />
            {service.rating} ({service.reviews} reviews*)
          </p>
          <p className="muted text-lg leading-8">{service.description}</p>
          <p className="flex items-center gap-2 my-5">
            <Clock size={18} />
            {service.duration} minutes
          </p>
          <div className="detail-price">
            <strong>{money(service.price)}</strong>
            <QuantityButton service={service} />
          </div>
          <Link to="/cart" className="button w-full mt-4">
            View cart & choose a slot
          </Link>
          <h2 className="text-xl font-semibold mt-8 mb-4">What’s included</h2>
          {service.includes.map((item) => (
            <p className="flex items-center gap-3 my-3" key={item}>
              <Check size={18} className="text-purple-700" />
              {item}
            </p>
          ))}
          <p className="notice mt-6">
            <ShieldCheck size={20} />
            Spare parts or additional work require a separate quote and your
            approval.
          </p>
        </div>
      </div>
    </main>
  );
}
