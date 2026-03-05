// context/AppContext.jsx
import { createContext, useState, useEffect } from "react";

// 1️⃣ Create context
export const AppContext = createContext();

// 2️⃣ Create provider
export const AppProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [filters, setFilters] = useState({
    date: "",
    price: "",
    description: "",
    condition: "",
  });
  const [theme, setTheme] = useState("light");

  // Undo/redo snapshots
  const [snapshots, setSnapshots] = useState([]); // stores {entries, wallet}
  const [future, setFuture] = useState([]);

  // Action history (for logging)
  const [history, setHistory] = useState([]);

  // Add action to history log with optional date
  const addHistory = (action, date = null) => {
    setHistory((prev) => {
      const timestamp = date || new Date().toISOString().split("T")[0];
      const newHistory = [...prev, { action, date: timestamp }];
      if (newHistory.length > 100) newHistory.shift();
      return newHistory;
    });
  };

  // Wrapper to track snapshots when entries change
  const updateEntries = (newEntries) => {
    setSnapshots((prev) => [...prev, { entries, wallet }].slice(-5));
    setEntries(newEntries);
  };

  const updateWallet = (newWallet) => {
    setSnapshots((prev) => [...prev, { entries, wallet }].slice(-5));
    setWallet(newWallet);
  };

  // Recalculate expenses whenever entries or filters change
  useEffect(() => {
    const filteredEntries = entries.filter((entry) => {
      const matchDate = filters.date ? entry.date === filters.date : true;
      const matchPrice = filters.price ? entry.price.toString() === filters.price : true;
      const matchDesc = filters.description ? entry.name === filters.description : true;
      const matchCond =
        filters.condition
          ? filters.condition === "true"
            ? entry.condition === true
            : entry.condition === false
          : true;
      return matchDate && matchPrice && matchDesc && matchCond;
    });

    const totalExpenses = filteredEntries
      .filter((e) => e.condition)
      .reduce((sum, e) => sum + e.price, 0);
    setExpenses(totalExpenses);
  }, [entries, filters]);

  // Undo / Redo
  const undo = () => {
    if (snapshots.length === 0) return;
    const last = snapshots[snapshots.length - 1];
    setFuture((prev) => [{ entries, wallet }, ...prev]);
    setEntries(last.entries);
    setWallet(last.wallet);
    setSnapshots((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setSnapshots((prev) => [...prev, { entries, wallet }]);
    setEntries(next.entries);
    setWallet(next.wallet);
    setFuture((prev) => prev.slice(1));
  };

  // 3️⃣ Context value
  const value = {
    entries,
    setEntries: updateEntries,
    wallet,
    setWallet: updateWallet,
    expenses,
    setExpenses,
    filters,
    setFilters,
    theme,
    setTheme,
    history,
    addHistory,
    snapshots,
    future,
    undo,
    redo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};