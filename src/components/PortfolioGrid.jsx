import { Link } from "react-router-dom";

function PortfolioGrid( {items}) {
 
  return (
    <section className="portfolio-section">

      <div className="gallery">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <div className="imgBox">{item.title}</div>
            <p className="name">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PortfolioGrid;
