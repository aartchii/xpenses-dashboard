// components/ImageUpload.jsx
import { useState } from "react";

const ImageUpload = ({ setBackgroundImage }) => {
  const [fileName, setFileName] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      setBackgroundImage(`url(${evt.target.result})`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label
        style={{
          cursor: "pointer",
          backgroundColor: "#555",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "6px",
        }}
      >
        Upload Background
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </label>
      {fileName && <span style={{ color: "#ccc" }}>{fileName}</span>}
    </div>
  );
};

export default ImageUpload;