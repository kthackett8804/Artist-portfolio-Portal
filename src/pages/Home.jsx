import { useState, useEffect } from "react";
import PortfolioGrid from "../components/PortfolioGrid";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Azure Blob Storage account URL - update this with your actual URL
  const BLOB_ACCOUNT = "https://storageaccountcw2.blob.core.windows.net";

  function buildBlobUrl(filePath) {
    if (!filePath) return "";
    const trimmed = String(filePath).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed; // already absolute
    const left = (BLOB_ACCOUNT || "").replace(/\/+$/g, "");
    const right = trimmed.replace(/^\/+/g, "");
    const sasToken = "?sp=r&st=2025-12-14T14:07:30Z&se=2026-01-01T22:22:30Z&spr=https&sv=2024-11-04&sr=c&sig=LcFDj6PX6PAqQex9SLNT86L%2Fam%2FBgRXnARlz7IK5K4o%3D";
    console.log(`${left}/${right}/${sasToken}`);
    return `${left}/${right}${sasToken}`;
  }

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/portfolios");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the data to match PortfolioGrid expected format
        const transformedData = data.map(item => ({
          id: item.id,
          title: item.pieceName,
          name: item.artistName,
          imageURL: buildBlobUrl(item.imageURL)
        }));
        
        // Get only the first 4 items
        const firstFour = transformedData.slice(0, 3);
        setPortfolioItems(firstFour);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div>
        <h3 className="submittedLabel">Loading portfolios...</h3>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="submittedLabel">Error loading portfolios</h3>
        <p>Error: {error}</p>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <h3 className="submittedLabel">Portfolios already submitted!</h3>
      <PortfolioGrid items={portfolioItems} />
      <Link to="/submissions">
        <button className="mainDesignBtn">View all Submissions</button>
      </Link>
      <Footer />
    </div>
  );
}

export default Home;