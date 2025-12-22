import { useState, useEffect } from "react";
import PortfolioGrid from "../components/PortfolioGrid";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BLOB_ACCOUNT = "https://storageaccountcw2.blob.core.windows.net";

  function buildBlobUrl(filePath) {
    if (!filePath) return "";
    if (/^https?:\/\//i.test(filePath)) return filePath;

    const sasToken =
      "?sp=r&st=2025-12-14T14:07:30Z&se=2026-01-01T22:22:30Z&spr=https&sv=2024-11-04&sr=c&sig=LcFDj6PX6PAqQex9SLNT86L%2Fam%2FBgRXnARlz7IK5K4o%3D";

    return `${BLOB_ACCOUNT}/${filePath.replace(/^\/+/g, "")}${sasToken}`;
  }

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/portfolios");
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();

        const firstThree = data.slice(0, 3).map(item => ({
          id: item.id,
          title: item.pieceName,
          name: item.artistName,
          imageURL: buildBlobUrl(item.imageURL)
        }));

        setPortfolioItems(firstThree);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="homePage homePageLoading">
        <h3 className="submittedLabel">Loading portfolios...</h3>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="homePage homePageError">
        <h3 className="submittedLabel">Error loading portfolios</h3>
        <p>{error}</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homePage">
      <h3 className="submittedLabel">Portfolios already submitted!</h3>

      <PortfolioGrid items={portfolioItems} />

      <Link to="/submissions">
        <button className="mainDesignBtn">
          View all Submissions
        </button>
      </Link>

      <Footer />
    </div>
  );
}

export default Home;
