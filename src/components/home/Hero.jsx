import { Star, UsersRound } from "lucide-react";
import CategoryGrid from "./CategoryGrid";
import { asset } from "../../config/site";
export default function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>
          Home services at
          <br className="desktop-break" /> your doorstep
        </h1>
        <CategoryGrid />
        <div className="hero-stats">
          <div>
            <Star size={29} fill="currentColor" />
            <span>
              <strong>4.8</strong>
              <small>Service rating*</small>
            </span>
          </div>
          <div>
            <UsersRound size={32} />
            <span>
              <strong>12M+</strong>
              <small>Customers globally*</small>
            </span>
          </div>
        </div>
      </div>
      <div className="hero-photo">
        <img
          src={asset("hero.jpeg")}
          alt="Professionals providing beauty, massage, home cleaning and AC services"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
