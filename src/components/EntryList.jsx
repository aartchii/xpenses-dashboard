// components/EntryList.jsx
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import * as XLSX from "xlsx";
import EntryItem from "./EntryItem.jsx";

const EntryList = () => {
  const {
    entries = [],
    setEntries,
    expenses,
    setExpenses,
    addHistory,
    filters,
    setFilters,
  } = useContext(AppContext);

  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Entry state (with location + link)
  const [newEntry, setNewEntry] = useState({
    name: "",
    price: "",
    date: "",
    location: "",
    link: "",
    condition: false,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleNewEntryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addManualEntry = () => {
    if (!newEntry.name || !newEntry.price || !newEntry.date) return;

    const entry = {
      code: `entry-${entries.length + 1}`,
      name: newEntry.name,
      price: Number(newEntry.price),
      date: newEntry.date,
      location: newEntry.location,
      link: newEntry.link,
      condition: newEntry.condition,
    };

    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);

    if (entry.condition) {
      setExpenses(expenses + entry.price);
    }

    addHistory &&
      addHistory(
        `Added new entry "${entry.name}" costing ¥${entry.price}`
      );

    setNewEntry({
      name: "",
      price: "",
      date: "",
      location: "",
      link: "",
      condition: false,
    });
  };

  // Unique filter options
  const uniqueDates = [...new Set(entries.map((e) => e.date))];
  const uniquePrices = [...new Set(entries.map((e) => e.price))];
  const uniqueDescriptions = [...new Set(entries.map((e) => e.name))];
  const uniqueConditions = ["true", "false"];

  // Filtering logic
  const filteredEntries = entries.filter((entry) => {
    const matchDate = filters.date ? entry.date === filters.date : true;
    const matchPrice = filters.price
      ? entry.price.toString() === filters.price
      : true;
    const matchDesc = filters.description
      ? entry.name === filters.description
      : true;

    const matchCond = filters.condition
      ? filters.condition === "true"
        ? entry.condition === true
        : entry.condition === false
      : true;

    return matchDate && matchPrice && matchDesc && matchCond;
  });

  // Pagination
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

  // File upload
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      const entriesWithCode = json.map((item, index) => ({
        code: item.code || `entry-${index + 1}`,
        name: item.name || "",
        price: Number(item.price) || 0,
        date: item.date || "",
        location: item.location || "",
        link: item.link || "",
        condition: item.condition === "true" || item.condition === true,
      }));

      setEntries(entriesWithCode);
      setCurrentPage(1);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="entry-list">
      <h2>Entry List</h2>

      {/* Manual Entry Form */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={newEntry.name}
          onChange={handleNewEntryChange}
        />

        <input
          type="number"
          placeholder="Price"
          name="price"
          value={newEntry.price}
          onChange={handleNewEntryChange}
        />

        <input
          type="date"
          name="date"
          value={newEntry.date}
          onChange={handleNewEntryChange}
        />

        <input
          type="text"
          placeholder="Location"
          name="location"
          value={newEntry.location}
          onChange={handleNewEntryChange}
        />

        <input
          type="text"
          placeholder="Link"
          name="link"
          value={newEntry.link}
          onChange={handleNewEntryChange}
        />

        <label>
          <input
            type="checkbox"
            name="condition"
            checked={newEntry.condition}
            onChange={handleNewEntryChange}
          />{" "}
          Checked
        </label>

        <button onClick={addManualEntry}>Add Entry</button>
      </div>

      {/* File Upload */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
      {fileName && <p>Loaded file: {fileName}</p>}

      {/* Filters */}
      {entries.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          <select name="date" value={filters.date} onChange={handleFilterChange}>
            <option value="">All Dates</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
          >
            <option value="">All Prices</option>
            {uniquePrices.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            name="description"
            value={filters.description}
            onChange={handleFilterChange}
          >
            <option value="">All Names</option>
            {uniqueDescriptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <select
            name="condition"
            value={filters.condition}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {uniqueConditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <p>List is empty. Please import an Excel file or add an entry.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
            {currentEntries.map((entry, idx) => (
              <EntryItem
                key={entry.code}
                entry={entry}
                index={indexOfFirstEntry + idx}
              />
            ))}
          </ul>

          {/* Pagination */}
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