import PortfolioGrid from "../components/PortfolioGrid";
import { useState } from "react";

function Submissions() {

  const Allsubmissions = [
    { id: 1, title: "image 1", name: "name2" },
    { id: 2, title: "image 2", name: "name" },
    { id: 3, title: "image 3", name: "name" },
    { id: 4, title: "image 4", name: "name" },
    { id: 5, title: "image 5", name: "name" },
    { id: 6, title: "image 6", name: "name" },
    { id: 7, title: "image 7", name: "name" },
    { id: 8, title: "image 8", name: "name" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  
const filteredSubmissions = Allsubmissions.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div>

      <h2 className="submittedLabel">Submissions</h2>

      <h2>Search by name...</h2>
      <input
        type="text"
        placeholder=""
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", marginBottom: "16px", width: "100%" }}
      />

      <PortfolioGrid items={filteredSubmissions}></PortfolioGrid>
      
    </div>
  );
}

export default Submissions;
