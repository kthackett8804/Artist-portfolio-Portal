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
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

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

      // Clear galleries error when user makes selection
      if (errors.GalleriesToSubmit) {
        setErrors({ ...errors, GalleriesToSubmit: "" });
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
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(uploadedFile.type)) {
        setErrors({ ...errors, imageFile: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)" });
        return;
      }

      // Clear any previous image errors
      if (errors.imageFile) {
        setErrors({ ...errors, imageFile: "" });
      }

      setImageFile(uploadedFile);
      setPreviewURL(URL.createObjectURL(uploadedFile));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate piece name
    if (!form.pieceName.trim()) {
      newErrors.pieceName = "Piece name is required";
    } else if (form.pieceName.length < 2) {
      newErrors.pieceName = "Piece name must be at least 2 characters";
    } else if (form.pieceName.length > 100) {
      newErrors.pieceName = "Piece name must be less than 100 characters";
    }

    // Validate artist name
    if (!form.artistName.trim()) {
      newErrors.artistName = "Artist name is required";
    } else if (form.artistName.length < 2) {
      newErrors.artistName = "Artist name must be at least 2 characters";
    } else if (form.artistName.length > 100) {
      newErrors.artistName = "Artist name must be less than 100 characters";
    }

    // Validate art medium
    if (!form.artMedium.trim()) {
      newErrors.artMedium = "Art medium is required";
    } else if (form.artMedium.length > 50) {
      newErrors.artMedium = "Art medium must be less than 50 characters";
    }

    // Validate style
    if (!form.style.trim()) {
      newErrors.style = "Style is required";
    } else if (form.style.length > 50) {
      newErrors.style = "Style must be less than 50 characters";
    }

    // Validate creation date
    if (!form.creationDate) {
      newErrors.creationDate = "Creation date is required";
    } else {
      const selectedDate = new Date(form.creationDate);
      const today = new Date();
      const minDate = new Date("1800-01-01");

      if (selectedDate > today) {
        newErrors.creationDate = "Creation date cannot be in the future";
      } else if (selectedDate < minDate) {
        newErrors.creationDate = "Please enter a valid date";
      }
    }

    // Validate galleries
    if (form.GalleriesToSubmit.length === 0) {
      newErrors.GalleriesToSubmit = "Please select at least one gallery";
    }

    // Validate image file
    if (!imageFile) {
      newErrors.imageFile = "Please upload an artwork image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      setMessage("Please fix the errors before submitting");
      return;
    }

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
      setMessage("Portfolio uploaded successfully with ID " + JSON.stringify(result.id) + "!");
      console.log("Upload result:", JSON.stringify(result));
      
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
      setErrors({});

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
        {errors.imageFile && (
          <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
            {errors.imageFile}
          </div>
        )}
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
          {errors.pieceName && (
            <span style={{ color: "red", fontSize: "14px", display: "block", marginTop: "5px" }}>
              {errors.pieceName}
            </span>
          )}
        </label>

        <label>
          Artist name:
          <input
            type="text"
            name="artistName"
            value={form.artistName}
            onChange={handleChange}
          />
          {errors.artistName && (
            <span style={{ color: "red", fontSize: "14px", display: "block", marginTop: "5px" }}>
              {errors.artistName}
            </span>
          )}
        </label>

        <label>
          Art Medium:
          <input
            type="text"
            name="artMedium"
            value={form.artMedium}
            onChange={handleChange}
          />
          {errors.artMedium && (
            <span style={{ color: "red", fontSize: "14px", display: "block", marginTop: "5px" }}>
              {errors.artMedium}
            </span>
          )}
        </label>

        <label>
          Style:
          <input
            type="text"
            name="style"
            value={form.style}
            onChange={handleChange}
          />
          {errors.style && (
            <span style={{ color: "red", fontSize: "14px", display: "block", marginTop: "5px" }}>
              {errors.style}
            </span>
          )}
        </label>

        <label>
          Creation Date:
          <input
            type="date"
            name="creationDate"
            value={form.creationDate}
            onChange={handleChange}
          />
          {errors.creationDate && (
            <span style={{ color: "red", fontSize: "14px", display: "block", marginTop: "5px" }}>
              {errors.creationDate}
            </span>
          )}
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
          {errors.GalleriesToSubmit && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.GalleriesToSubmit}
            </div>
          )}
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