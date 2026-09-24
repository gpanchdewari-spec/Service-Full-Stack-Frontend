import { createContext, useContext, useEffect, useState } from "react";
import { services as samples, categories, cities } from "../../shared/catalog";
import { api, demoMode } from "../api/client";

const AppContext = createContext(null);

function saved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [services, setServices] = useState(demoMode ? samples : []),
    [loading, setLoading] = useState(!demoMode),
    [error, setError] = useState(""),
    [user, setUser] = useState(null),
    [city, setCity] = useState(() => saved("uc-city", "Delhi NCR")),
    [pinCode, setPinCode] = useState(() => saved("uc-pin-code", "")),
    [cart, setCart] = useState(() => saved("uc-cart", []));

  useEffect(() => {
    if (!demoMode) {
      api
        .get("/services")
        .then((response) => setServices(response.data.services))
        .catch(() =>
          setError(
            "Services could not be loaded. Check that the backend is running, then retry.",
          ),
        )
        .finally(() => setLoading(false));

      api
        .get("/auth/me")
        .then((response) => setUser(response.data.user))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("uc-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("uc-city", JSON.stringify(city));
  }, [city]);

  useEffect(() => {
    localStorage.setItem("uc-pin-code", JSON.stringify(pinCode));
  }, [pinCode]);

  const add = (slug) =>
    setCart((old) =>
      old.some((item) => item.slug === slug)
        ? old.map((item) =>
            item.slug === slug
              ? {
                  ...item,
                  quantity: Math.min(5, item.quantity + 1),
                }
              : item,
          )
        : [...old, { slug, quantity: 1 }],
    );

  const change = (slug, delta) =>
    setCart((old) =>
      old
        .map((item) =>
          item.slug === slug
            ? {
                ...item,
                quantity: Math.min(5, item.quantity + delta),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

  const items = cart
    .map((item) => ({
      ...services.find((service) => service.slug === item.slug),
      quantity: item.quantity,
    }))
    .filter((item) => item.name);

  const signOut = async () => {
    if (!demoMode) await api.post("/auth/logout");

    setUser(null);
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        services,
        categories,
        cities,
        loading,
        error,
        user,
        setUser,
        city,
        setCity,
        pinCode,
        setPinCode,
        cart,
        items,
        add,
        change,
        clearCart: () => setCart([]),
        signOut,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
