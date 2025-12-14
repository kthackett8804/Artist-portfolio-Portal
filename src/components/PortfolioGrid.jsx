import { Link } from "react-router-dom";

function PortfolioGrid({ items }) {
 
  return (
    <section className="portfolio-section">
      <div className="gallery">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <div className="imgBox">
              {item.imageURL ? (
                <img 
                  src={item.imageURL} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f0f0f0'
                }}>
                  No Image
                </div>
              )}
            </div>
            <p className="name">{item.title}</p>
            <p className="name">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PortfolioGrid;