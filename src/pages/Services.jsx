import { useSearchParams, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import ServiceCard from "../components/services/ServiceCard";
export default function Services() {
  const { services, categories, loading, error } = useApp();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "",
    q = params.get("q") || "",
    sort = params.get("sort") || "recommended";
  let list = services.filter(
    (s) =>
      (!category || s.category === category) &&
      s.name.toLowerCase().includes(q.toLowerCase()),
  );
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  const update = (k, v) => {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next);
  };
  return (
    <main className="container page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> / Services
      </p>
      <h1>
        {categories.find((c) => c.slug === category)?.short ||
          "Services for your home"}
      </h1>
      <p className="muted mt-3">
        Choose a service. We’ll take care of the rest.
      </p>
      <div className="catalog-tools">
        <div className="search-box">
          <Search size={19} />
          <input
            aria-label="Filter services"
            placeholder="Find a service"
            value={q}
            onChange={(e) => update("q", e.target.value)}
          />
        </div>
        <select
          aria-label="Sort services"
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <div className="filter-chips">
        <button
          className={!category ? "active" : ""}
          onClick={() => update("category", "")}
        >
          All services
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={category === c.slug ? "active" : ""}
            onClick={() => update("category", c.slug)}
          >
            {c.short}
          </button>
        ))}
      </div>
      {error ? (
        <p className="error">{error}</p>
      ) : loading ? (
        <p className="notice">Loading services…</p>
      ) : list.length ? (
        <div className="catalog-grid">
          {list.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No services found</h2>
          <p>Try another search or category.</p>
          <button className="button mt-4" onClick={() => setParams({})}>
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
