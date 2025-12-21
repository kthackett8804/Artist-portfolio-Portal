import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/NavBar";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Submissions from "./pages/Submissions";
import ModifyPortfolio from "./pages/ModifyPortfolio";
import DeletePortfolio from "./pages/DeletePortfolio";
import ImageAnalyser from "./pages/ImageAnalyser";

function App() {
  return (
    <div className="container">
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/modifyportfolio" element={<ModifyPortfolio />} />
        <Route path="/deletePortfolio" element={<DeletePortfolio />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/imageanalyser" element={<ImageAnalyser />} />
      </Routes>
    </div>
  );
}

export default App;
