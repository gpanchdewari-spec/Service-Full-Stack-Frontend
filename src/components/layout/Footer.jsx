import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/" className="brand">
          <span className="brand-mark">UC</span>
          <span>
            Urban
            <br />
            Company
          </span>
        </Link>
        <div className="footer-grid">
          <div>
            <h3>Home, taken care of.</h3>
            <p>Everyday services, right at your doorstep.</p>
          </div>
          <div>
            <h4>Explore services</h4>
            <Link to="/services?category=women">Beauty & wellness</Link>
            <Link to="/services?category=cleaning">Home cleaning</Link>
            <Link to="/services?category=appliance">Appliance repair</Link>
          </div>
          <div>
            <h4>For customers</h4>
            <Link to="/bookings">My bookings</Link>
            <Link to="/cart">My cart</Link>
            <Link to="/services">All services</Link>
          </div>
          <div>
            <h4>Your account</h4>
            <Link to="/login">Login / Sign up</Link>
            <Link to="/help">Help centre</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            Independent learning project. Not affiliated with Urban Company.
          </span>
          <span>Built with care, for your home.</span>
        </div>
      </div>
    </footer>
  );
}
