import PortfolioGrid from "../components/PortfolioGrid";
import { useState, useEffect } from "react";

function Submissions() {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResized, setShowResized] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [showIndividual, setShowIndividual] = useState(false);

  // Azure Blob Storage account URL base
  const BLOB_STORAGE_BASE = "https://storageaccountcw2.blob.core.windows.net";

  const buildBlobUrl = (filePath, isResized) => {
    if (!filePath) return "";
    const trimmed = String(filePath).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed; // already absolute
    
    let blobPath = trimmed.replace(/^\/+/g, "");
    
    if (isResized) {
      // Replace "images/" with "resized-images/"
      blobPath = blobPath.replace(/^images\//, "resized-images/");
    }

    const sasToken = isResized 
      ? "?sp=r&st=2025-12-14T14:24:28Z&se=2026-01-01T22:39:28Z&spr=https&sv=2024-11-04&sr=c&sig=eyPfVUD1M3v7CCc9bYY4OFSUnMkNbRQJtjiS3p5iuRU%3D" 
      : "?sp=r&st=2025-12-14T14:07:30Z&se=2026-01-01T22:22:30Z&spr=https&sv=2024-11-04&sr=c&sig=LcFDj6PX6PAqQex9SLNT86L%2Fam%2FBgRXnARlz7IK5K4o%3D";
    
    return `${BLOB_STORAGE_BASE}/${blobPath}${sasToken}`;
  };

  const fetchIndividualSubmission = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/v1/portfolios/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform single item
      const transformedData = [{
        id: data.id,
        title: "Title: " + data.pieceName,
        name: "Artist: " + data.artistName,
        imageURL: buildBlobUrl(data.imageURL, false)
      }];
      
      setAllSubmissions(transformedData);
      setShowIndividual(true);
    } catch (err) {
      console.error("Error fetching individual submission:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch based on current view (original or resized)
      const endpoint = showResized 
        ? "/api/v1/portfolios/resized" 
        : "/api/v1/portfolios";
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match PortfolioGrid expected format
      const transformedData = data.map(item => {
        // Handle different structures for original vs resized
        const id = showResized ? item.Id : item.id;
        const title = showResized ? "Resized Image" : "Title: " + item.pieceName;
        const name = showResized ?  " ": "Artist: " + item.artistName;
        const imagePath = showResized ? item.Path : item.imageURL;
        
        return {
          id: id,
          title: title,
          name: name,
          imageURL: buildBlobUrl(imagePath, showResized)
        };
      });
      
      setAllSubmissions(transformedData);
      setShowIndividual(false);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showIndividual) {
      fetchAllSubmissions();
    }
  }, [showResized]); // Re-fetch when showResized changes

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchIndividualSubmission(searchId.trim());
    }
  };

  const handleBackToAll = () => {
    setShowIndividual(false);
    setSearchId("");
    fetchAllSubmissions();
  };

  if (loading) {
    return (
      <div>
        <h2 className="submittedLabel">Loading submissions...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="submittedLabel">Error loading submissions</h2>
        <p>Error: {error}</p>
        <button onClick={handleBackToAll} style={{ padding: "8px 16px", marginTop: "8px" }}>
          Back to All Submissions
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="submittedLabel">Submissions</h2>

      {/* Search by ID Form */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Original submission ID"
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
        {showIndividual && (
          <button
            type="button"
            onClick={handleBackToAll}
            style={{
              padding: "8px 16px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Show All
          </button>
        )}
      </form>

      {/* Toggle Buttons - Only show when viewing all */}
      {!showIndividual && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            onClick={() => {
              console.log("Original button clicked");
              setShowResized(false);
            }}
            style={{
              padding: "8px",
              flex: 1,
              background: !showResized ? "#ddd" : "#f8f8f8"
            }}
          >
            Original
          </button>

          <button
            onClick={() => {
              console.log("Resized button clicked");
              setShowResized(true);
            }}
            style={{
              padding: "8px",
              flex: 1,
              background: showResized ? "#ddd" : "#f8f8f8"
            }}
          >
            Resized
          </button>
        </div>
      )}

      {showIndividual && (
        <p style={{ marginBottom: "16px", fontStyle: "italic" }}>
        </p>
      )}

      <PortfolioGrid items={allSubmissions} />
    </div>
  );
}

export default Submissions;