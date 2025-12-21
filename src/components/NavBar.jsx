import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="nav">
      <Link to="/"><button>Home</button></Link>
      <Link to="/portfolio"><button>Create Portfolio</button></Link>
      <Link to="/modifyportfolio"><button>Modify Portfolio</button></Link>
      <Link to="/deletePortfolio"><button>Delete Portfolio</button></Link>
      <Link to="/submissions"><button>View all Submissions</button></Link>
      <Link to="/imageanalyser"><button>Art Analyser</button></Link>
    </nav>
  );
}

export default Navbar;
