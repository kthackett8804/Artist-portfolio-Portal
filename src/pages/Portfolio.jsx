import { useState } from "react";

function Portfolio() {

  const [form, setForm] = useState({
    pieceName: "",
    artistName: "",
    medium: "",
    style: "",
    creationDate: "",
    galleries: [],
  });

  const galleryOptions = [
    "Modern Arts Gallery",
    "Studio One Exhibition Hall",
    "Open Canvas Collective",
  ];

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

 const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "galleries") {
      let updatedGalleries = [...form.galleries];
      if (checked) {
        updatedGalleries.push(value);
      } else {
        updatedGalleries = updatedGalleries.filter((g) => g !== value);
      }
      setForm({
        ...form,
        galleries: updatedGalleries,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

 

const handleImageUpload = (event) => {
  const uploadedFile = event.target.files[0];

  if (uploadedFile) {
    setImageFile(uploadedFile);
    setPreviewURL(URL.createObjectURL(uploadedFile));
  }};

  return (
    <div className="pagePadding">

      <h2 className="submittedLabel">Your Portfolio!</h2>

      
          <div className="uploadSection">
            {previewURL ? (<img className="uploadImages" src={previewURL} alt="Uploaded art preview" />) : ( <h2>Upload Your Artwork!</h2>)}

            <br></br>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
         

        <div className="formSection">
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
              value={form.medium} 
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
            <label key={gallery}>
              <input
                type="checkbox"
                name="galleries"
                value={gallery}
                checked={form.galleries.includes(gallery)}
                onChange={handleChange}
              />
              {gallery}
            </label>
          ))}
        </div>

          <button className="mainDesignBtn">Resize portfolio?</button>
        </div>



      <div className="buttonRow">
        <button className="mainDesignBtn">Upload</button>
        <button className="mainDesignBtn">Edit</button>
        <button className="mainDesignBtn">Delete</button>
      </div>
    </div>
  );
}

export default Portfolio;
