import PortfolioGrid from "../components/PortfolioGrid";
import { useState } from "react";

function Submissions() {

  const Allsubmissions = [
    { id: 1, title: "image 1", name: "name2", url: "/uploads/image/img1.jpg" },
    { id: 2, title: "image 2", name: "name",  url: "/uploads/image/img2.jpg" },
    { id: 3, title: "image 3", name: "name",  url: "/uploads/image/img3.jpg" },
    { id: 4, title: "image 4", name: "name",  url: "/uploads/image/img4.jpg" },
    { id: 5, title: "image 5", name: "name",  url: "/uploads/image/img5.jpg" },
    { id: 6, title: "image 6", name: "name",  url: "/uploads/resized-image/img6.jpg" },
    { id: 7, title: "image 7", name: "name",  url: "/uploads/image/img7.jpg" },
    { id: 8, title: "image 8", name: "name",  url: "/uploads/image/img8.jpg" },
  ];

  const [showResized, setShowResized] = useState(false);

  const filteredSubmissions = Allsubmissions.filter(item => {
    if (showResized) {
      return item.url.includes("/uploads/resized-image/");
    } else {
      return item.url.includes("/uploads/image/") && !item.url.includes("/uploads/resized-image/");
    }
  });

  return (
    <div>
      <h2 className="submittedLabel">Submissions</h2>

      {/* Toggle Buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button
          onClick={() => setShowResized(false)}
          style={{
            padding: "8px",
            flex: 1,
            background: !showResized ? "#ddd" : "#f8f8f8"
          }}
        >
          Original
        </button>

        <button
          onClick={() => setShowResized(true)}
          style={{
            padding: "8px",
            flex: 1,
            background: showResized ? "#ddd" : "#f8f8f8"
          }}
        >
          Resized
        </button>
      </div>

      <PortfolioGrid items={filteredSubmissions} />
    </div>
  );
}

export default Submissions;
