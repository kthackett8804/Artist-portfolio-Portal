import { useState } from "react";

function ModifyPortfolio() {

  const [form, setForm] = useState({
    portfolioId: "",
    pieceName: "",
    artistName: "",
    artMedium: "",
    style: "",
    creationDate: "",
    imageURL: "",
    GalleriesToSubmit: [],
  });

  const [apiID, setApiID] = useState({
    id: "",
  });

  const galleryOptions = [
  {name: "Tech Art Gallery", location: "London" },
  { name: "Digital Expressions", location: "New York" },
  { name: "Modern Arts Hub", location: "Berlin" },

  ];

 const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "galleries") {

      let updatedGalleries = [...form.GalleriesToSubmit];
      const selectedGallery = galleryOptions.find((g) => g.name === value);

     if (checked) {
        // Add the object if not already included
        if (!updatedGalleries.some((g) => g.name === value)) {
          updatedGalleries.push(selectedGallery);
        }
      } else {
        // Remove the object if unchecked
        updatedGalleries = updatedGalleries.filter((g) => g.name !== value);
      }

      setForm({
        ...form,
        GalleriesToSubmit: updatedGalleries,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }

    setApiID({
      ...apiID,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
  const data = new FormData();
  data.append("portfolio", JSON.stringify(form));
  data.append("file", imageFile);

};

  return (
    <div className="pagePadding">

      <h2 className="submittedLabel">Modify your Portfolio!</h2>

<div className="uploadSection">
          
          </div>
      
        <div className="formSection">

            <label>
            ID: 
            <input 
              type="text" 
              name="portfolioId" 
              value={apiID.id} 
              onChange={handleChange} 
            />
          </label>

            <label>
            Portfolio ID: 
            <input 
              type="text" 
              name="portfolioId" 
              value={form.portfolioId} 
              onChange={handleChange} 
            />
          </label>

          <label>
            Piece name: 
            <input 
              type="text" 
              name="pieceName" 
              value={form.pieceName} 
              onChange={handleChange} 
            />
          </label>

          <label>
            Artist name: 
            <input 
              type="text" 
              name="artistName" 
              value={form.artistName} 
              onChange={handleChange} 
            />
          </label>

          <label>
            Art Medium: 
            <input 
              type="text" 
              name="medium" 
              value={form.artMedium} 
              onChange={handleChange} 
            />
          </label>

          <label>
            Style: 
            <input 
              type="text" 
              name="style" 
              value={form.style} 
              onChange={handleChange} 
            />
          </label>

          <label>
            Creation Date: 
            <input 
              type="date" 
              name="creationDate" 
              value={form.creationDate} 
              onChange={handleChange} 
            />
          </label>

          
         <div>
          Galleries to submit portfolio to:
          {galleryOptions.map((gallery) => (
            <label key={gallery.name}>
              <input
                type="checkbox"
                name="galleries"
                value={gallery.name}
                checked={form.GalleriesToSubmit.some((g) => g.name === gallery.name)}
                onChange={handleChange}
              />
              {gallery.name}

              
          <span aria-label={`Location of ${gallery.name}`}>
        ({gallery.location})
      </span>

            </label>
          ))}
        </div>

        <label>
            Image URL: 
            <input 
              type="text" 
              name="imageURL" 
              value={form.imageURL} 
              onChange={handleChange} 
            />
          </label>

          <div className="buttonRow">
        <button className="mainDesignBtn" onClick={handleSubmit}>Modify</button>
      </div>
        </div>

    </div>
  );
}

export default ModifyPortfolio;
