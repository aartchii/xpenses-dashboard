import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import * as XLSX from "xlsx";
import EntryItem from "./EntryItem.jsx";
import Filters from "./Filters.jsx";

const EntryList = () => {
  const {
    filteredEntries = [],
    setEntries,
  } = useContext(AppContext);

  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // ======================
  // MANUAL ENTRY STATE
  // ======================
  const [newEntry, setNewEntry] = useState({
    name: "",
    price: "",
    date: "",
    location: "",
    link: "",
    condition: false,
    console: "",
    type: "",
    city: "",
  });

  const handleNewEntryChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewEntry((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ======================
  // ADD MANUAL ENTRY
  // ======================
  const addManualEntry = () => {
    if (!newEntry.name || !newEntry.price || !newEntry.date) return;

    const entry = {
      code: `entry-${Date.now()}`,
      ...newEntry,
    };

    setEntries((prev) => [...prev, entry]);

    setNewEntry({
      name: "",
      price: "",
      date: "",
      location: "",
      link: "",
      condition: false,
      console: "",
      type: "",
      city: "",
    });
  };

  // ======================
  // EXCEL IMPORT (NO CONVERSION HERE!)
  // ======================
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { raw: false });

      const entriesFromExcel = json.map((item, index) => ({
        code: item.code || `entry-${index + 1}`,
        name: item.name || "",
        price: item.price, // 🔥 KEEP RAW (FIXED IN CONTEXT)
        date: item.date || "",
        location: item.location || "",
        link: item.link || "",
        condition: item.condition === "true" || item.condition === true,
        console: item.console || "",
        type: item.type || "",
        city: item.city || "",
      }));

      setEntries(entriesFromExcel);
      setCurrentPage(1);
    };

    reader.readAsArrayBuffer(file);
  };

  // ======================
  // PAGINATION
  // ======================
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const handlePrev = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  // ======================
  // RENDER
  // ======================
  return (
    <div className="entry-list">
      <h2>Entry List</h2>

      {/* ======================
          MANUAL ENTRY FORM
      ====================== */}
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        <input name="name" value={newEntry.name} onChange={handleNewEntryChange} placeholder="Name" />
        <input name="price" value={newEntry.price} onChange={handleNewEntryChange} placeholder="Price" />
        <input name="date" value={newEntry.date} onChange={handleNewEntryChange} type="date" />
        <input name="location" value={newEntry.location} onChange={handleNewEntryChange} placeholder="Location" />
        <input name="console" value={newEntry.console} onChange={handleNewEntryChange} placeholder="Console" />
        <input name="type" value={newEntry.type} onChange={handleNewEntryChange} placeholder="Type" />
        <input name="city" value={newEntry.city} onChange={handleNewEntryChange} placeholder="City" />
        <input name="link" value={newEntry.link} onChange={handleNewEntryChange} placeholder="Link" />

        <label>
          <input
            type="checkbox"
            name="condition"
            checked={newEntry.condition}
            onChange={handleNewEntryChange}
          />
          Checked
        </label>

        <button onClick={addManualEntry}>Add Entry</button>
      </div>

      {/* ======================
          FILE UPLOAD
      ====================== */}
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
      {fileName && <p>Loaded file: {fileName}</p>}

      {/* ======================
          FILTERS
      ====================== */}
      {filteredEntries.length > 0 && <Filters />}

      {/* ======================
          LIST
      ====================== */}
      {filteredEntries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {currentEntries.map((entry) => (
              <EntryItem key={entry.code} entry={entry} />
            ))}
          </ul>

          {/* PAGINATION */}
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EntryList;