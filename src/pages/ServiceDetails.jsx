import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { asset, money } from "../config/site";
import { QuantityButton } from "../components/services/ServiceCard";

export default function ServiceDetails() {
  const { slug } = useParams();
  const { services, loading } = useApp();

  const service = services.find((item) => item.slug === slug);
  const includes = Array.isArray(service?.includes) ? service.includes : [];

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-5 py-12 text-neutral-500">
        Loading service…
      </main>
    );
  }

  if (!service) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-6xl flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Service not found
        </h1>
        <p className="mt-3 text-neutral-500">
          This service may no longer be available.
        </p>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-violet-700"
        >
          <ArrowLeft size={17} />
          Browse services
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-500"
        >
          <Link to="/" className="hover:text-neutral-900">
            Home
          </Link>
          <span>/</span>
          <Link to="/services" className="hover:text-neutral-900">
            Services
          </Link>
          <span>/</span>
          <span className="text-neutral-900">{service.name}</span>
        </nav>

        <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* Service image */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-lg bg-neutral-100">
              <img
                src={asset(service.image)}
                alt={service.name}
                className="block h-[280px] w-full object-cover sm:h-[360px] lg:h-[400px]"
              />
            </div>
          </div>

          {/* Service information */}
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
              {service.name}
            </h1>

            {service.rating != null && (
              <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
                <Star size={17} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-neutral-900">
                  {service.rating}
                </span>
                {service.reviews != null && (
                  <span>({service.reviews} reviews)</span>
                )}
              </div>
            )}

            {service.description && (
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
                {service.description}
              </p>
            )}

            {service.duration != null && (
              <div className="mt-6 flex items-center gap-2 text-sm text-neutral-600">
                <Clock3 size={18} />
                <span>{service.duration} minutes</span>
              </div>
            )}

            {/* Price and action */}
            <div className="mt-8 border-t border-neutral-200 pt-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Starts at</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                    {money(service.price)}
                  </p>
                </div>

                <QuantityButton service={service} />
              </div>

              <Link
                to="/cart"
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white! transition-colors hover:bg-neutral-700 hover:text-white!"
              >
                View cart & choose a slot
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* Included items */}
            {includes.length > 0 && (
              <section className="mt-10 border-t border-neutral-200 pt-8">
                <h2 className="text-lg font-semibold text-neutral-900">
                  What’s included
                </h2>

                <ul className="mt-5 space-y-3">
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-6 text-neutral-600"
                    >
                      <Check
                        size={18}
                        className="mt-0.5 shrink-0 text-neutral-900"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-9 flex items-start gap-3 border-t border-neutral-200 pt-6">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-neutral-700"
              />
              <p className="text-sm leading-6 text-neutral-500">
                Spare parts or additional work will be quoted separately and
                done only with your approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
