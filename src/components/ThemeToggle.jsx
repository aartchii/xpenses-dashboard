// components/ThemeToggle.jsx
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(AppContext);

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "8px 12px",
        marginBottom: "20px",
        borderRadius: "6px",
        backgroundColor: theme === "light" ? "#333" : "#f5f5f5",
        color: theme === "light" ? "#fff" : "#000",
        border: "1px solid #888",
        cursor: "pointer",
      }}
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;