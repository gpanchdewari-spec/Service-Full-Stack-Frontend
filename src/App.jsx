import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import Help from "./pages/Help";
import useWebMCP from "./hooks/useWebMCP";
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useWebMCP();
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Navbar />
      <div id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/help" element={<Help />} />
          <Route
            path="*"
            element={
              <main className="container page">
                <h1>Page not found</h1>
                <Link to="/">Back to home</Link>
              </main>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
