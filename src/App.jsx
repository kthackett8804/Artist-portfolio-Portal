import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/NavBar";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Submissions from "./pages/Submissions";

function App() {
  return (
    <div className="container">
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/submissions" element={<Submissions />} />
      </Routes>
    </div>
  );
}

export default App;
