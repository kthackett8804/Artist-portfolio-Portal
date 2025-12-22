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
        title: data.pieceName,
        name: data.artistName,
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
      
      const endpoint = showResized 
        ? "/api/v1/portfolios/resized" 
        : "/api/v1/portfolios";
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const transformedData = data.map(item => {

        const id = showResized ? item.Id : item.id;
        const title = showResized ? "Resized Image" : item.pieceName;
        const name = showResized ? item.DisplayName : item.artistName;
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
      <div className="loadingMessage">
        <h2 className="submittedLabel">Loading submissions...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="errorMessage">
        <h2 className="submittedLabel">Error loading submissions</h2>
        <p>Error: {error}</p>
        <button onClick={handleBackToAll} className="errorButton">
          Back to All Submissions
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="submittedLabel">Submissions</h2>

      <form onSubmit={handleSearchSubmit} className="searchForm">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Original submission ID"
          className="searchInput"
        />
        <button type="submit" className="searchButton">
          Search
        </button>
        {showIndividual && (
          <button
            type="button"
            onClick={handleBackToAll}
            className="showAllButton"
          >
            Show All
          </button>
        )}
      </form>

      {!showIndividual && (
        <div className="toggleButtonsRow">
          <button
            onClick={() => {
              console.log("Original button clicked");
              setShowResized(false);
            }}
            className="toggleButton"
          >
            Original
          </button>

          <button
            onClick={() => {
              console.log("Resized button clicked");
              setShowResized(true);
            }}
            className="toggleButton"
          >
            Resized
          </button>
        </div>
      )}

      {showIndividual && (
        <p className="individualNote">
        </p>
      )}

      <PortfolioGrid items={allSubmissions} />
    </div>
  );
}

export default Submissions;