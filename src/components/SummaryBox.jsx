// components/SummaryBox.jsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import * as XLSX from "xlsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryBox = () => {
  const { entries = [], expenses = 0, wallet = 0, setWallet, addHistory } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const [displayWallet, setDisplayWallet] = useState(wallet);
  const [displayExpenses, setDisplayExpenses] = useState(expenses);

  // Adjust wallet
  const adjustWallet = (type) => {
    const value = Number(inputValue);
    if (!isNaN(value)) {
      const newWallet = type === "increase" ? wallet + value : wallet - value;
      setWallet(newWallet);
      addHistory(`${type === "increase" ? "Added" : "Removed"} €${value} ${type === "increase" ? "to" : "from"} wallet`, new Date().toISOString().split("T")[0]);
      setInputValue("");
    }
  };

  useEffect(() => {
    const duration = 500;
    const steps = 30;
    const walletStep = (wallet - displayWallet) / steps;
    const expensesStep = (expenses - displayExpenses) / steps;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayWallet((prev) => prev + walletStep);
      setDisplayExpenses((prev) => prev + expensesStep);
      if (i >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [wallet, expenses]);

  const remainingAmount = wallet - expenses;

  const pieData = {
    labels: ["Available", "Used"],
    datasets: [
      {
        data: [Math.max(remainingAmount, 0), expenses],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverOffset: 10,
      },
    ],
  };

  const exportEntriesToFile = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");
    XLSX.writeFile(workbook, "entries.xlsx");
  };

  return (
    <div style={{ border: "1px solid #555", padding: "10px", width: "240px", borderRadius: "8px", backgroundColor: "#333", color: "#fff", fontFamily: "sans-serif" }}>
      <h3 style={{ marginBottom: "10px" }}>Summary</h3>
      <div style={{ color: "#4caf50", marginBottom: "5px" }}>Available: €{displayWallet.toFixed(2)}</div>
      <div style={{ color: "#f44336", marginBottom: "5px" }}>Expenses: €{displayExpenses.toFixed(2)}</div>
      <div style={{ color: "#2196F3", marginBottom: "10px" }}>Remaining: €{remainingAmount.toFixed(2)}</div>

      <input
        type="number"
        placeholder="Enter amount"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "100%", marginBottom: "5px", padding: "5px", borderRadius: "4px", border: "1px solid #555", backgroundColor: "#444", color: "#fff" }}
      />

      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <button onClick={() => adjustWallet("increase")} style={{ flex: 1, backgroundColor: "#4caf50" }}>+ Add</button>
        <button onClick={() => adjustWallet("decrease")} style={{ flex: 1, backgroundColor: "#f44336" }}>- Remove</button>
      </div>

      <button
        onClick={exportEntriesToFile}
        style={{ width: "100%", backgroundColor: "#2196F3", color: "#fff", border: "1px solid #888", padding: "10px", marginBottom: "10px" }}
      >
        Export Entries
      </button>

      <div style={{ backgroundColor: "#222", padding: "10px", borderRadius: "8px", marginTop: "10px" }}>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default SummaryBox;