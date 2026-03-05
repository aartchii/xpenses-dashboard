// components/EntryItem.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const EntryItem = ({ entry, index }) => {
  const { entries, setEntries, expenses, setExpenses, addHistory } = useContext(AppContext);

  const toggleCondition = () => {
    const newEntries = [...entries];
    newEntries[index].condition = !newEntries[index].condition;

    // Recalculate expenses
    const newExpenses = newEntries
      .filter((e) => e.condition)
      .reduce((sum, e) => sum + Number(e.price), 0);

    setEntries(newEntries);
    setExpenses(newExpenses);

    addHistory &&
      addHistory(
        `You ${newEntries[index].condition ? "checked" : "unchecked"} "${
          newEntries[index].name
        }" costing €${newEntries[index].price}`
      );
  };

  return (
    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
      <input type="checkbox" checked={entry.condition} onChange={toggleCondition} />
      <span style={{ flex: 1 }}>{entry.name}</span>
      <span>€{entry.price}</span>
      <span>{entry.date}</span>
    </li>
  );
};

export default EntryItem;