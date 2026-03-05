import { AppProvider } from "./context/AppContext.jsx";
import History from "./components/History.jsx";
import EntryList from "./components/EntryList.jsx";
import SummaryBox from "./components/SummaryBox.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import ImageUpload from "./components/ImageUpload.jsx";
import { useState } from "react";

function App() {
  const [backgroundImage, setBackgroundImage] = useState("");

  return (
    <AppProvider>
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          minHeight: "100vh",
          backgroundColor: "#222",
          color: "#fff",
        }}
      >
        <h1>Expense Tracker</h1>

        {/* Header: Theme toggle + Image upload */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <ThemeToggle />
          <ImageUpload setBackgroundImage={setBackgroundImage} />
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <SummaryBox />
          <div
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              background: backgroundImage ? `${backgroundImage} no-repeat center/cover` : "#333",
            }}
          >
            <EntryList />
          </div>
        </div>

        <History />
      </div>
    </AppProvider>
  );
}

export default App;