import { useState } from "react";

function Portfolio() {

  const [form, setForm] = useState({
    pieceName: "",
    artistName: "",
    medium: "",
    style: "",
    creationDate: "",
    galleries: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setForm({
      ...form,
      [fieldName]: fieldValue,
    });
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

          <label>
            Galleries to submit portfolio to: 
            <select
              name="galleries"
              value={form.galleries}
              onChange={handleChange}
            >
              <option value="">Select a gallery...</option>
              <option value="Modern Arts Gallery">Modern Arts Gallery</option>
              <option value="Studio One Exhibition Hall">Studio One Exhibition Hall</option>
              <option value="Open Canvas Collective">Open Canvas Collective</option>
            </select>
          </label>

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
