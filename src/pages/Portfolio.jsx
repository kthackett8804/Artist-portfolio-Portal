import { useState } from "react";

function Portfolio() {
  const [form, setForm] = useState({
    pieceName: "",
    artistName: "",
    artMedium: "",
    style: "",
    creationDate: "",
    GalleriesToSubmit: [],
  });

  const galleryOptions = [
    { name: "Tech Art Gallery", location: "London" },
    { name: "Digital Expressions", location: "New York" },
    { name: "Modern Arts Hub", location: "Berlin" },
  ];

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "galleries") {
      let updatedGalleries = [...form.GalleriesToSubmit];
      const selectedGallery = galleryOptions.find((g) => g.name === value);

      if (checked) {
        if (!updatedGalleries.some((g) => g.name === value)) {
          updatedGalleries.push(selectedGallery);
        }
      } else {
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
  };

  const handleImageUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      setImageFile(uploadedFile);
      setPreviewURL(URL.createObjectURL(uploadedFile));
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setMessage("");

      const data = new FormData();
      
      // Append each form field individually
      data.append("pieceName", form.pieceName);
      data.append("artistName", form.artistName);
      data.append("artMedium", form.artMedium);
      data.append("style", form.style);
      data.append("creationDate", form.creationDate);
      data.append("GalleriesToSubmit", JSON.stringify(form.GalleriesToSubmit));
      
      if (imageFile) {
        data.append("file", imageFile);
      }

      const response = await fetch("/api/v1/portfolios", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      setMessage("Portfolio uploaded successfully!");
      
      // Reset form
      setForm({
        pieceName: "",
        artistName: "",
        artMedium: "",
        style: "",
        creationDate: "",
        GalleriesToSubmit: [],
      });
      setImageFile(null);
      setPreviewURL(null);

    } catch (error) {
      console.error("Error uploading portfolio:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pagePadding">
      <h2 className="submittedLabel">Your Portfolio!</h2>

      <div className="uploadSection">
        {previewURL ? (
          <img className="uploadImages" src={previewURL} alt="Uploaded art preview" />
        ) : (
          <h2>Upload Your Artwork!</h2>
        )}

        <br />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
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
            name="artMedium"
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

        {message && (
          <div style={{ margin: "10px 0", padding: "10px", backgroundColor: message.includes("Error") ? "#fee" : "#efe" }}>
            {message}
          </div>
        )}

        <div className="buttonRow">
          <button 
            className="mainDesignBtn" 
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;