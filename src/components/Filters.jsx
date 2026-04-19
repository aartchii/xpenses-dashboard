import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const Filters = () => {
  const { entries = [], filters, setFilters } = useContext(AppContext);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const uniqueDates = [...new Set(entries.map((e) => e.date))].filter(Boolean);
  const uniqueDescriptions = [...new Set(entries.map((e) => e.name))].filter(Boolean);
  const uniqueLocations = [...new Set(entries.map((e) => e.location))].filter(Boolean);
  const uniqueConsoles = [...new Set(entries.map((e) => e.console))].filter(Boolean);
  const uniqueCities = [...new Set(entries.map((e) => e.city))].filter(Boolean);

  const uniqueConditions = ["true", "false"];

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "10px",
        flexWrap: "wrap",
      }}
    >
      {/* Date */}
      <select name="date" value={filters.date} onChange={handleFilterChange}>
        <option value="">All Dates</option>
        {uniqueDates.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Price Range */}
      <select name="price" value={filters.price} onChange={handleFilterChange}>
        <option value="">All Prices</option>
        <option value="50-1000">50 - 1,000</option>
        <option value="1000-3000">1,000 - 3,000</option>
        <option value="3500-5000">3,500 - 5,000</option>
        <option value="5000-10000">5,000 - 10,000</option>
        <option value="10000-20000">10,000 - 20,000</option>
        <option value="20000+">20,000+</option>
      </select>

      {/* Name */}
      <select
        name="description"
        value={filters.description}
        onChange={handleFilterChange}
      >
        <option value="">All Names</option>
        {uniqueDescriptions.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {/* Location */}
      <select
        name="location"
        value={filters.location}
        onChange={handleFilterChange}
      >
        <option value="">All Locations</option>
        {uniqueLocations.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      {/* Console */}
      <select
        name="console"
        value={filters.console}
        onChange={handleFilterChange}
      >
        <option value="">All Consoles</option>
        {uniqueConsoles.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* CITY */}
      <select name="city" value={filters.city} onChange={handleFilterChange}>
        <option value="">All Cities</option>
        {uniqueCities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* ✅ TYPE FILTER (FIXED: software / hardware / figure) */}
      <select name="type" value={filters.type} onChange={handleFilterChange}>
        <option value="">All Types</option>
        <option value="software">Software</option>
        <option value="hardware">Hardware</option>
        <option value="figure">Figure</option>
      </select>

      {/* Condition */}
      <select
        name="condition"
        value={filters.condition}
        onChange={handleFilterChange}
      >
        <option value="">All</option>
        {uniqueConditions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;