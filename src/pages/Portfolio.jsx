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
  {name: "Tech Art Gallery", location: "London" },
  { name: "Digital Expressions", location: "New York" },
  { name: "Modern Arts Hub", location: "Berlin" },

  ];

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

 const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    //prev code didnt handle gallery as object
    // if (name === "galleries") {
    //   let updatedGalleries = [...form.galleries];
    //   if (checked) {
    //     updatedGalleries.push(value);
    //   } else {
    //     updatedGalleries = updatedGalleries.filter((g) => g !== value);
    //   }

    if (name === "galleries") {

      let updatedGalleries = [...form.galleries];
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
            <label key={gallery.name}>
              <input
                type="checkbox"
                name="galleries"
                value={gallery.name}
                checked={form.galleries.some((g) => g.name === gallery.name)}
                onChange={handleChange}
              />
              {gallery.name}

              
          <span aria-label={`Location of ${gallery.name}`}>
        ({gallery.location})
      </span>

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
