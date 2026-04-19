import { createContext, useState, useMemo, useEffect } from "react";

export const AppContext = createContext();

const SESSION_KEYS = {
  entries: "session_entries",
  wallet: "session_wallet",
};

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

const normalizeText = (text) =>
  text ? String(text).trim().toLowerCase() : "";

const normalizeType = (type) =>
  type ? String(type).trim().toLowerCase() : "";

// ======================
// SINGLE SOURCE OF TRUTH NORMALIZER
// ======================
const normalizeEntry = (e) => ({
  ...e,
  code: e.code || `entry-${Date.now()}-${Math.random()}`,
  price: normalizePrice(e.price),
  type: normalizeType(e.type),
  console: normalizeText(e.console),
  city: normalizeText(e.city),
  location: normalizeText(e.location),
  date: e.date || "",
  condition: Boolean(e.condition),
});

export const AppProvider = ({ children }) => {
  // ======================
  // LOAD SESSION (CLEAN RESTORE)
  // ======================
  const [entries, setEntries] = useState(() => {
    const saved = sessionStorage.getItem(SESSION_KEYS.entries);
    return saved ? JSON.parse(saved).map(normalizeEntry) : [];
  });

  const [wallet, setWallet] = useState(() => {
    const saved = sessionStorage.getItem(SESSION_KEYS.wallet);
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

  // ======================
  // SAVE SESSION
  // ======================
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEYS.entries, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEYS.wallet, String(wallet));
  }, [wallet]);

  // ======================
  // HISTORY
  // ======================
  const addHistory = (action) => {
    setHistory((prev) => {
      const updated = [...prev, { id: Date.now(), action }];
      if (updated.length > 200) updated.shift();
      return updated;
    });
  };

  // ======================
  // WALLET
  // ======================
  const updateWallet = (value, message = null) => {
    setWallet(Number(value) || 0);
    if (message) addHistory(message);
  };

  const increaseWallet = (amount) =>
    updateWallet(wallet + amount, `Added ¥${amount}`);

  const decreaseWallet = (amount) =>
    updateWallet(wallet - amount, `Removed ¥${amount}`);

  // ======================
  // ENTRY ACTIONS
  // ======================
  const addEntry = (entry) => {
    const newEntry = normalizeEntry({
      ...entry,
      code: `entry-${Date.now()}`,
    });

    setEntries((prev) => [...prev, newEntry]);
    addHistory(`Added "${entry.name}"`);
  };

  const toggleEntryCondition = (code) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.code === code ? { ...e, condition: !e.condition } : e
      )
    );
  };

  const updateEntries = (newEntries) => {
    setEntries(newEntries.map(normalizeEntry));
  };

  // ======================
  // EXPENSES (REBUILD ALWAYS CORRECT)
  // ======================
  const expenses = useMemo(() => {
    return entries
      .filter((e) => e.condition)
      .reduce((sum, e) => sum + normalizePrice(e.price), 0);
  }, [entries]);

  // ======================
  // REMAINING (ALWAYS SYNCS AFTER RELOAD)
  // ======================
  const remaining = useMemo(() => wallet - expenses, [wallet, expenses]);

  // ======================
  // FILTERED ENTRIES
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
  // CONTEXT VALUE
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
        remaining,

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