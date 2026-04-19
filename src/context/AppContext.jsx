import { createContext, useState, useMemo, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ======================
  // LOAD FROM LOCALSTORAGE (PERSISTENCE)
  // ======================
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [];
  });

  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem("wallet");
    return saved ? Number(saved) : 0;
  });

  const [filters, setFilters] = useState({
    date: "",
    price: "",
    description: "",
    condition: "",
    location: "",
    console: "",
    type: "",
    city: "",
  });

  const [history, setHistory] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [future, setFuture] = useState([]);

  // ======================
  // AUTO SAVE (CRITICAL)
  // ======================
  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("wallet", wallet);
  }, [wallet]);

  // ======================
  // NORMALIZERS
  // ======================
  const normalizePrice = (price) => {
    if (price === null || price === undefined) return 0;
    if (typeof price === "number") return price;

    const cleaned = String(price)
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/\s/g, "");

    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const normalizeType = (type) =>
    type ? String(type).trim().toLowerCase() : "";

  const normalizeText = (text) =>
    text ? String(text).trim().toLowerCase() : "";

  // ======================
  // HISTORY
  // ======================
  const addHistory = (action, date = null) => {
    const timestamp = date || new Date().toISOString().split("T")[0];

    setHistory((prev) => {
      const updated = [...prev, { id: Date.now(), action, date: timestamp }];
      if (updated.length > 200) updated.shift();
      return updated;
    });
  };

  // ======================
  // WALLET
  // ======================
  const updateWallet = (value, message = null) => {
    setSnapshots((prev) => [...prev, { entries, wallet }].slice(-10));
    setWallet(value);

    if (message) addHistory(message);
  };

  const increaseWallet = (amount) => {
    updateWallet(wallet + amount, `Added ¥${amount} to wallet`);
  };

  const decreaseWallet = (amount) => {
    updateWallet(wallet - amount, `Removed ¥${amount} from wallet`);
  };

  // ======================
  // ENTRY ACTIONS
  // ======================
  const addEntry = (entry) => {
    const newEntries = [
      ...entries,
      {
        ...entry,
        code: `entry-${Date.now()}`,
        price: normalizePrice(entry.price),
        type: normalizeType(entry.type),
        console: normalizeText(entry.console),
        city: normalizeText(entry.city),
        condition: Boolean(entry.condition),
      },
    ];

    setEntries(newEntries);
    addHistory(`Added entry "${entry.name}" costing ¥${entry.price}`);
  };

  const toggleEntryCondition = (code) => {
    setEntries((prev) => {
      const updated = prev.map((e) =>
        e.code === code ? { ...e, condition: !e.condition } : e
      );

      const changed = prev.find((e) => e.code === code);

      if (changed) {
        addHistory(
          `You ${
            !changed.condition ? "checked" : "unchecked"
          } "${changed.name}" costing ¥${changed.price}`
        );
      }

      return updated;
    });
  };

  const updateEntries = (newEntries) => {
    const normalized = newEntries.map((e) => ({
      ...e,
      price: normalizePrice(e.price),
      type: normalizeType(e.type),
      console: normalizeText(e.console),
      city: normalizeText(e.city),
      condition: Boolean(e.condition),
    }));

    setEntries(normalized);
  };

  // ======================
  // EXPENSES
  // ======================
  const expenses = useMemo(() => {
    return entries
      .filter((e) => e.condition)
      .reduce((sum, e) => sum + normalizePrice(e.price), 0);
  }, [entries]);

  // ======================
  // FILTERS
  // ======================
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchDate = filters.date ? entry.date === filters.date : true;
      const price = normalizePrice(entry.price);

      const matchPrice = (() => {
        if (!filters.price) return true;

        switch (filters.price) {
          case "50-1000":
            return price >= 50 && price <= 1000;
          case "1000-3000":
            return price > 1000 && price <= 3000;
          case "3500-5000":
            return price > 3500 && price <= 5000;
          case "5000-10000":
            return price > 5000 && price <= 10000;
          case "10000-20000":
            return price > 10000 && price <= 20000;
          case "20000+":
            return price > 20000;
          default:
            return true;
        }
      })();

      const matchDesc = filters.description
        ? normalizeText(entry.name) === normalizeText(filters.description)
        : true;

      const matchCond = filters.condition
        ? filters.condition === "true"
          ? entry.condition === true
          : entry.condition === false
        : true;

      const matchLocation = filters.location
        ? normalizeText(entry.location) === normalizeText(filters.location)
        : true;

      const matchConsole = filters.console
        ? normalizeText(entry.console) === normalizeText(filters.console)
        : true;

      const matchType = filters.type
        ? normalizeType(entry.type) === normalizeType(filters.type)
        : true;

      const matchCity = filters.city
        ? normalizeText(entry.city) === normalizeText(filters.city)
        : true;

      return (
        matchDate &&
        matchPrice &&
        matchDesc &&
        matchCond &&
        matchLocation &&
        matchConsole &&
        matchType &&
        matchCity
      );
    });
  }, [entries, filters]);

  // ======================
  // CONTEXT
  // ======================
  return (
    <AppContext.Provider
      value={{
        entries,
        setEntries: updateEntries,

        addEntry,
        toggleEntryCondition,

        wallet,
        setWallet: updateWallet,
        increaseWallet,
        decreaseWallet,

        expenses,

        filters,
        setFilters,

        history,
        addHistory,

        filteredEntries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};