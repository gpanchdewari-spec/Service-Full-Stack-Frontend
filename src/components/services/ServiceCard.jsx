import { Link } from "react-router-dom";
import { Star, Plus, Minus } from "lucide-react";
import { asset, money } from "../../config/site";
import { useApp } from "../../context/AppContext";
export function QuantityButton({ service }) {
  const { cart, add, change } = useApp();
  const qty = cart.find((i) => i.slug === service.slug)?.quantity || 0;
  return qty ? (
    <div className="quantity">
      <button
        onClick={() => change(service.slug, -1)}
        aria-label={`Remove one ${service.name}`}
      >
        <Minus size={15} />
      </button>
      <span>{qty}</span>
      <button
        disabled={qty >= 5}
        onClick={() => change(service.slug, 1)}
        aria-label={`Add one ${service.name}`}
      >
        <Plus size={15} />
      </button>
    </div>
  ) : (
    <button className="add-button" onClick={() => add(service.slug)}>
      Add <Plus size={14} />
    </button>
  );
}
export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <Link to={`/services/${service.slug}`}>
        <div className="service-image">
          <img loading="lazy" src={asset(service.image)} alt={service.name} />
        </div>
        <h3>{service.name}</h3>
      </Link>
      <div className="rating">
        <Star size={13} fill="currentColor" /> {service.rating}{" "}
        <span>({service.reviews})</span>
      </div>
      <div className="flex justify-between items-center mt-3 gap-2">
        <strong className="text-sm">{money(service.price)}</strong>
        <QuantityButton service={service} />
      </div>
    </article>
  );
}
