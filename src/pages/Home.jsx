import PortfolioGrid from "../components/PortfolioGrid";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";


function Home() {

    const portfolioItems = [
    { id: 1, title: "image 1", name: "name" },
    { id: 2, title: "image 2", name: "name" },
    { id: 3, title: "image 3", name: "name" },
    { id: 4, title: "image 4", name: "name" },
  ];

  return (
  
    <div>
        <h3 className="submittedLabel">Portfolios already submitted!</h3>
        <PortfolioGrid items={portfolioItems}/>
        <Link to="/submissions"><button className="mainDesignBtn">View all Submissions</button></Link>
        <Footer/>
      </div>
  );
}

export default Home;
