// components/WalletInput.jsx
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";

const WalletInput = () => {
  const { wallet, setWallet, addHistory } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");

  const handleWalletUpdate = () => {
    const value = Number(inputValue);
    if (!isNaN(value)) {
      setWallet(value);
      addHistory && addHistory(`Wallet set to ¥${value}`);
      setInputValue("");
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        type="number"
        placeholder="Enter available money"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "5px",
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid #555",
          backgroundColor: "#444",
          color: "#fff",
        }}
      />
      <button
        onClick={handleWalletUpdate}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #888",
          backgroundColor: "#555",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Set Wallet
      </button>
    </div>
  );
};

export default WalletInput;