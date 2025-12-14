import { useState } from "react";

function DeletePortfolio() {
  const [apiID, setApiID] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setApiID(value);
  };

  const handleSubmit = async () => {
    if (!apiID.trim()) {
      setMessage("Please enter an ID to delete");
      return;
    }

    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete portfolio with ID: ${apiID.trim()}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch(`/api/v1/portfolios/${apiID.trim()}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      const result = await response.json();
      setMessage("Portfolio deleted successfully!");
      
      // Clear the ID field after successful deletion
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
          <input
            type="text"
            name="portfolioId"
            value={apiID}
            onChange={handleChange}
            placeholder="Enter portfolio ID to delete"
          />
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
          ⚠️ Warning: This action is permanent and cannot be undone.
        </p>
      </div>
    </div>
  );
}

export default DeletePortfolio;