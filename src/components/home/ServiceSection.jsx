import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ServiceCard from "../services/ServiceCard";
export default function ServiceSection({
  title,
  subtitle,
  services,
  href = "/services",
}) {
  const ref = useRef(null);
  return (
    <section className="service-section">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="flex gap-2 items-center">
          <Link className="see-all" to={href}>
            See all
          </Link>
          <button
            aria-label={`Scroll ${title} left`}
            className="circle-arrow"
            onClick={() =>
              ref.current.scrollBy({ left: -480, behavior: "smooth" })
            }
          >
            <ChevronLeft size={19} />
          </button>
          <button
            aria-label={`Scroll ${title} right`}
            className="circle-arrow"
            onClick={() =>
              ref.current.scrollBy({ left: 480, behavior: "smooth" })
            }
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
      <div ref={ref} className="service-row">
        {services.map((s) => (
          <ServiceCard service={s} key={s.slug} />
        ))}
      </div>
    </section>
  );
}
