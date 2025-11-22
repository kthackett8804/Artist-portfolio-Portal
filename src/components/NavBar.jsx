import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="nav">
      <Link to="/"><button>Home</button></Link>
      <Link to="/portfolio"><button>Your Portfolio</button></Link>
      <Link to="/submissions"><button>View all Submissions</button></Link>
    </nav>
  );
}

export default Navbar;
