// components/History.jsx
import { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext.jsx";

const History = () => {
  const { history = [] } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("");

  const entriesPerPage = 10;

  // Filter history independently
  const filteredHistory = useMemo(() => {
    return filterDate
      ? history.filter((h) => h.date === filterDate)
      : history;
  }, [history, filterDate]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  const currentEntries = filteredHistory.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const totalPages = Math.ceil(filteredHistory.length / entriesPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div
      style={{
        marginTop: "20px",
        border: "1px solid gray",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#333",
      }}
    >
      <h3>History</h3>

      {/* Date Filter */}
      {history.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "5px" }}>Filter by Date:</label>

          <select
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Dates</option>

            {[...new Set(history.map((h) => h.date))].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* History list */}
      {filteredHistory.length === 0 ? (
        <p>No actions yet.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {currentEntries.map((entry, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: "5px",
                  padding: "5px",
                  background: "#444",
                  borderRadius: "4px",
                }}
              >
                <strong>{entry.date}:</strong>{" "}
                {entry.action.replace(/€/g, "¥")}
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
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

export default History;