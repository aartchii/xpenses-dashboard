// components/Filters.jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const Filters = () => {
  const { entries = [], filters, setFilters } = useContext(AppContext);

  // Compute unique filter options
  const uniqueDates = [...new Set(entries.map((e) => e.date))];
  const uniquePrices = [...new Set(entries.map((e) => e.price))];
  const uniqueDescriptions = [...new Set(entries.map((e) => e.name))];
  const uniqueConditions = ["true", "false"];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
      <select name="date" value={filters.date} onChange={handleFilterChange}>
        <option value="">All Dates</option>
        {uniqueDates.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select name="price" value={filters.price} onChange={handleFilterChange}>
        <option value="">All Prices</option>
        {uniquePrices.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select name="description" value={filters.description} onChange={handleFilterChange}>
        <option value="">All Names</option>
        {uniqueDescriptions.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <select name="condition" value={filters.condition} onChange={handleFilterChange}>
        <option value="">All</option>
        {uniqueConditions.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};

export default Filters;