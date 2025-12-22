import { useState, useEffect } from "react";

function DeletePortfolio() {
  const [apiID, setApiID] = useState("");
  const [ids, setIds] = useState([]);
  const [loadingIds, setLoadingIds] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllIds();
  }, []);

  const fetchAllIds = async () => {
    try {
      setLoadingIds(true);
      const response = await fetch("/api/v1/portfolios");
      if (!response.ok) throw new Error(`Failed to fetch portfolios`);

      const data = await response.json();
      setIds(data.map(p => p.id).filter(Boolean));
    } catch (error) {
      setMessage(`Error loading IDs: ${error.message}`);
    } finally {
      setLoadingIds(false);
    }
  };

  const handleSubmit = async () => {
    if (!apiID) {
      setMessage("Please select an ID to delete");
      return;
    }

    if (!window.confirm(`Delete portfolio ${apiID}? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch(`/api/v1/portfolios/${apiID}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setMessage("Portfolio deleted successfully!");
      setIds(prev => prev.filter(id => id !== apiID));
      setApiID("");
    } catch (error) {
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
            onChange={e => setApiID(e.target.value)}
            disabled={loadingIds}
          >
            <option value="">
              {loadingIds ? "Loading IDs..." : "-- Select an ID --"}
            </option>
            {ids.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </label>

        {message && (
          <div
            className={`messageBox ${
              message.startsWith("Error") ? "messageError" : "messageSuccess"
            }`}
          >
            {message}
          </div>
        )}

        <div className="buttonRow">
          <button
            className="mainDesignBtn deleteBtn"
            onClick={handleSubmit}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePortfolio;
