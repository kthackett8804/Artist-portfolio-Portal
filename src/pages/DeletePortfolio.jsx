import { useState, useEffect } from "react";

function DeletePortfolio() {
  const [apiID, setApiID] = useState("");
  const [ids, setIds] = useState([]);
  const [loadingIds, setLoadingIds] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all portfolio IDs on mount
  useEffect(() => {
    fetchAllIds();
  }, []);

  const fetchAllIds = async () => {
    try {
      setLoadingIds(true);
      const response = await fetch("/api/v1/portfolios");

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolios: ${response.status}`);
      }

      const data = await response.json();
      const ids = Array.isArray(data)
        ? data.map((p) => p.id).filter(Boolean)
        : [];

      setIds(ids);
    } catch (error) {
      console.error("Error fetching portfolio IDs:", error);
      setMessage(`Error loading IDs: ${error.message}`);
    } finally {
      setLoadingIds(false);
    }
  };

  const handleChange = (event) => {
    setApiID(event.target.value);
  };

  const handleSubmit = async () => {
    if (!apiID.trim()) {
      setMessage("Please select an ID to delete");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete portfolio with ID: ${apiID}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch(`/api/v1/portfolios/${apiID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      await response.json();
      setMessage("Portfolio deleted successfully!");

      // Remove deleted ID from dropdown
      setIds((prev) => prev.filter((id) => id !== apiID));
      setApiID("");
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="pagePadding">
      <h2 className="submittedLabel">Delete your Portfolio!</h2>

      <div className="formSection">
        <label>
          ID:
          <select
            value={apiID}
            onChange={handleChange}
            disabled={loadingIds}
          >
            <option value="">
              {loadingIds ? "Loading IDs..." : "-- Select an ID --"}
            </option>
            {ids.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>

        {message && (
          <div
            style={{
              margin: "10px 0",
              padding: "10px",
              backgroundColor: message.includes("Error") ? "#fee" : "#efe",
            }}
          >
            {message}
          </div>
        )}

        <div className="buttonRow">
          <button
            className="mainDesignBtn"
            onClick={handleSubmit}
            disabled={deleting}
            style={{
              backgroundColor: deleting ? "#ccc" : "#dc3545",
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        <p style={{ fontSize: "0.9em", color: "#666", marginTop: "10px" }}>
          Warning: This action is permanent and cannot be undone.
        </p>
      </div>
    </div>
  );
}

export default DeletePortfolio;
