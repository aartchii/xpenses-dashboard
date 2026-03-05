// components/PieChart.jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { wallet, expenses } = useContext(AppContext);
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

  return (
    <div
      style={{
        backgroundColor: "#222",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <Pie data={pieData} />
    </div>
  );
};

export default PieChart;