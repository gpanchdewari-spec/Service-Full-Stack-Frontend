import { Link } from "react-router-dom";
import { asset } from "../../config/site";
export default function PromoBanners() {
  return (
    <section className="promos" aria-label="In the spotlight">
      <Link to="/services?category=appliance" className="custom-promo">
        <div>
          <span>CARE THAT GOES FURTHER</span>
          <h3>
            Give your appliances
            <br />a fresh start
          </h3>
          <b>Explore services →</b>
        </div>
        <img
          src={asset("purifier-service.jpeg")}
          alt="Water purifier service"
          loading="lazy"
        />
      </Link>
      <Link to="/services?category=painting">
        <img
          src={asset("banner-1.jpeg")}
          alt="Explore wall panels and home upgrades"
          loading="lazy"
        />
      </Link>
      <Link to="/services?category=repairs">
        <img
          src={asset("banner-2.jpeg")}
          alt="Home repairs at affordable prices — electricians, plumbers, carpenters"
          loading="lazy"
        />
      </Link>
    </section>
  );
}
