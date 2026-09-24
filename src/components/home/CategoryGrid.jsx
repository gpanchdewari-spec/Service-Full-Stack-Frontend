import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { asset } from "../../config/site";
export default function CategoryGrid() {
  const { categories } = useApp();
  return (
    <div className="category-panel">
      <h2>What are you looking for?</h2>
      <div className="category-grid">
        {categories.map((c) => (
          <Link
            to={`/services?category=${c.slug}`}
            key={c.slug}
            className="category"
          >
            <div className="category-image">
              <img src={asset(c.image)} alt="" />
            </div>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
      <Link to="/services?category=cleaning" className="instant-strip">
        <span>
          <strong>A cleaner home. A lighter day.</strong>
          <small>Explore professional home cleaning</small>
        </span>
        <span className="text-xl">↗</span>
      </Link>
    </div>
  );
}
