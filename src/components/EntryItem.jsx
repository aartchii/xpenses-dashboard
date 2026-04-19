import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const formatPrice = (price) => {
  if (price === null || price === undefined) return "-";
  return new Intl.NumberFormat("en-US").format(price);
};

const EntryItem = ({ entry }) => {
  const { toggleEntryCondition } = useContext(AppContext);

  const handleToggle = () => {
    toggleEntryCondition(entry.code);
  };

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "6px 0",
      }}
    >
      {/* ✅ FIX: always reliable boolean */}
      <input
        type="checkbox"
        checked={!!entry.condition}
        onChange={handleToggle}
      />

      <span style={{ flex: 1 }}>{entry.name || "-"}</span>

      <span style={{ flex: 1, opacity: 0.85 }}>{entry.type || "-"}</span>

      <span style={{ flex: 1, opacity: 0.85 }}>{entry.console || "-"}</span>

      <span style={{ flex: 1, opacity: 0.85 }}>{entry.city || "-"}</span>

      <span style={{ flex: 1, opacity: 0.7 }}>{entry.location || "-"}</span>

      <span style={{ flex: 1 }}>
        {entry.link ? (
          <a
            href={entry.link}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#4ea1ff" }}
          >
            Open
          </a>
        ) : (
          "-"
        )}
      </span>

      <span style={{ minWidth: "90px" }}>
        ¥{formatPrice(entry.price)}
      </span>

      <span>{entry.date || "-"}</span>
    </li>
  );
};

export default EntryItem;