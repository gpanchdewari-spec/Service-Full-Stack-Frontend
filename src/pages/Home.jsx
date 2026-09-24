import { Link } from "react-router-dom";
import { ShieldCheck, BadgeCheck, HeartHandshake } from "lucide-react";
import Hero from "../components/home/Hero";
import PromoBanners from "../components/home/PromoBanners";
import ServiceSection from "../components/home/ServiceSection";
import { useApp } from "../context/AppContext";
import { asset } from "../config/site";
export default function Home() {
  const { services, loading, error } = useApp();
  return (
    <main className="container">
      <Hero />
      <PromoBanners />
      <section className="service-section">
        <div className="section-heading">
          <h2>New and noteworthy</h2>
          <Link className="see-all" to="/services">
            Explore all
          </Link>
        </div>
        <div className="noteworthy">
          {[
            {
              name: "Full home cleaning",
              image: "home-cleaning.png",
              cat: "cleaning",
            },
            {
              name: "Home painting",
              image: "full-painting.jpeg",
              cat: "painting",
            },
            {
              name: "Living & bedroom cleaning",
              image: "room-cleaning.png",
              cat: "cleaning",
            },
            {
              name: "AC service & repair",
              image: "ac-service.jpeg",
              cat: "appliance",
            },
            { name: "Salon at home", image: "waxing.jpeg", cat: "women" },
          ].map((c) => (
            <Link key={c.name} to={`/services?category=${c.cat}`}>
              <img src={asset(c.image)} alt={c.name} loading="lazy" />
              <h3>{c.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      {loading && <p className="notice">Loading services…</p>}
      {error && (
        <div className="error">
          {error}{" "}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      {services.length > 0 && (
        <>
          <ServiceSection
            title="Most booked services"
            services={services.slice(0, 6)}
          />
          <div className="care-banner">
            <div>
              <span>HOME, BEAUTIFULLY CARED FOR</span>
              <h2>
                A little care.
                <br />A big difference.
              </h2>
              <p>Let the experts take care of the everyday.</p>
              <Link className="button" to="/services?category=cleaning">
                Explore home cleaning
              </Link>
            </div>
            <img
              src={asset("room-cleaning.png")}
              alt="Freshly cleaned living room"
              loading="lazy"
            />
          </div>
          {["women", "cleaning", "appliance", "repairs"].map((cat, i) => (
            <ServiceSection
              key={cat}
              title={
                [
                  "Salon for women",
                  "Cleaning essentials",
                  "Appliance repair & service",
                  "Home repair & installation",
                ][i]
              }
              subtitle={i === 0 ? "A little time, just for you." : undefined}
              services={services.filter((s) => s.category === cat)}
              href={`/services?category=${cat}`}
            />
          ))}
        </>
      )}
      <section className="why-section">
        <h2>Good service. Peace of mind.</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {[
            [
              ShieldCheck,
              "Transparent pricing",
              "Know the service price before you book.",
            ],
            [
              BadgeCheck,
              "Professional expertise",
              "The right skills and equipment for every job.",
            ],
            [
              HeartHandshake,
              "Care for your home",
              "Thoughtful service, from start to finish.",
            ],
          ].map(([Icon, title, text]) => (
            <div key={title}>
              <Icon size={32} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-8">
          *Brand statistics reproduced from the reference website; service
          prices and availability are sample data.
        </p>
      </section>
    </main>
  );
}
