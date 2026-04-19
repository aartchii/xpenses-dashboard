import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const EntryItem = ({ entry, index }) => {
  const { entries, setEntries, addHistory } = useContext(AppContext);

  const toggleCondition = () => {
    const newEntries = [...entries];
    newEntries[index].condition = !newEntries[index].condition;

    setEntries(newEntries);

    addHistory &&
      addHistory(
        `You ${newEntries[index].condition ? "checked" : "unchecked"} "${
          newEntries[index].name
        }" costing €${newEntries[index].price}`
      );
  };

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 0",
      }}
    >
      <input
        type="checkbox"
        checked={entry.condition}
        onChange={toggleCondition}
      />

      {/* Name */}
      <span style={{ flex: 1 }}>{entry.name}</span>

      {/* Location */}
      <span style={{ flex: 1, opacity: 0.8 }}>
        {entry.location || "-"}
      </span>

      {/* Link */}
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

      {/* Price */}
      <span>¥{entry.price}</span>

      {/* Date */}
      <span>{entry.date}</span>
    </li>
  );
};

export default EntryItem;