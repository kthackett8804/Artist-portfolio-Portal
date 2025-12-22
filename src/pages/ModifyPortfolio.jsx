import { useState, useEffect } from "react";

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

  const [apiID, setApiID] = useState("");
  const [ids, setIds] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const galleryOptions = [
    { name: "Tech Art Gallery", location: "London" },
    { name: "Digital Expressions", location: "New York" },
    { name: "Modern Arts Hub", location: "Berlin" },
  ];

  // Fetch all portfolio IDs on component mount
  useEffect(() => {
    fetchAllIds();
  }, []);

  const fetchAllIds = async () => {
    try {
      setLoadingIds(true);
      const response = await fetch("/api/v1/portfolios");

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolios: ${response.status}`);
      }

      const data = await response.json();
      const ids = Array.isArray(data) ? data.map(p => p.id).filter(Boolean) : [];
      setIds(ids);
    } catch (error) {
      console.error("Error fetching portfolio IDs:", error);
      setMessage(`Error loading IDs: ${error.message}`);
    } finally {
      setLoadingIds(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

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
    } else if (name === "id") {
      setApiID(value);
      // Clear ID error
      if (errors.apiID) {
        setErrors({ ...errors, apiID: "" });
      }
      // Auto-fetch when ID is selected from dropdown
      if (value) {
        handleFetchWithId(value);
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleFetch = async () => {
    if (!apiID.trim()) {
      setMessage("Please select an ID to fetch");
      return;
    }
    await handleFetchWithId(apiID);
  };

  const handleFetchWithId = async (id) => {
    if (!id.trim()) {
      setMessage("Please select an ID to fetch");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setErrors({});

      const response = await fetch(`/api/v1/portfolios/${id.trim()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse GalleriesToSubmit if it's a string
      let galleries = data.GalleriesToSubmit;
      console.log("Fetched galleries:", galleries);
      if (typeof galleries === "string") {
        try {
          galleries = JSON.parse(galleries);
        } catch (e) {
          galleries = [];
        }
      }

      setForm({
        portfolioId: data.portfolioId || "",
        pieceName: data.pieceName || "",
        artistName: data.artistName || "",
        artMedium: data.artMedium || "",
        style: data.style || "",
        creationDate: data.creationDate || "",
        imageURL: data.imageURL || "",
        GalleriesToSubmit: galleries || [],
      });

      setMessage("Portfolio loaded successfully!");
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate ID is selected
    if (!apiID.trim()) {
      newErrors.apiID = "Please select an ID";
    }

    // Validate portfolio ID
    if (!form.portfolioId.trim()) {
      newErrors.portfolioId = "Portfolio ID is required";
    }

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
      today.setHours(0, 0, 0, 0);
      const minDate = new Date("1800-01-01");

      if (selectedDate < minDate) {
        newErrors.creationDate = "Please enter a valid date";
      } else if (selectedDate > today) {
        newErrors.creationDate = "Creation date cannot be in the future";
      }
    }

    // Validate galleries
    if (form.GalleriesToSubmit.length === 0) {
      newErrors.GalleriesToSubmit = "Please select at least one gallery";
    }

    // Validate image URL
    if (!form.imageURL.trim()) {
      newErrors.imageURL = "Image URL is required";
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
      setUpdating(true);
      setMessage("");

      const data = new FormData();

      // Append each form field individually
      data.append("portfolioId", form.portfolioId);
      data.append("pieceName", form.pieceName);
      data.append("artistName", form.artistName);
      data.append("artMedium", form.artMedium);
      data.append("style", form.style);
      data.append("creationDate", form.creationDate);
      data.append("imageURL", form.imageURL);
      data.append("GalleriesToSubmit", JSON.stringify(form.GalleriesToSubmit));

      const response = await fetch(`/api/v1/portfolios/${apiID.trim()}`, {
        method: "PUT",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const result = await response.json();
      setMessage("Portfolio updated successfully!");
      setErrors({});
    } catch (error) {
      console.error("Error updating portfolio:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="pagePadding">
      <h2 className="submittedLabel">Modify your Portfolio!</h2>

      <div className="uploadSection">
      </div>

      <div className="formSection">
        <label>
          ID:
          <select
            name="id"
            value={apiID}
            onChange={handleChange}
            disabled={loadingIds}
          >
            <option value="">
              {loadingIds ? "Loading IDs..." : "-- Select an ID --"}
            </option>
            {ids.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          {errors.apiID && (
            <span className="errorTextBlock">
              {errors.apiID}
            </span>
          )}
        </label>

        <div className="buttonRow">
          <button
            className="mainDesignBtn"
            onClick={handleFetch}
            disabled={loading}
          >
            {loading ? "Loading..." : "Portfolio Fetched!"}
          </button>
        </div>

        <label>
          Portfolio ID:
          <input
            type="text"
            name="portfolioId"
            value={form.portfolioId}
            onChange={handleChange}
          />
          {errors.portfolioId && (
            <span className="errorTextBlock">
              {errors.portfolioId}
            </span>
          )}
        </label>

        <label>
          Piece name:
          <input
            type="text"
            name="pieceName"
            value={form.pieceName}
            onChange={handleChange}
          />
          {errors.pieceName && (
            <span className="errorTextBlock">
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
            <span className="errorTextBlock">
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
            <span className="errorTextBlock">
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
            <span className="errorTextBlock">
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
            <span className="errorTextBlock">
              {errors.creationDate}
            </span>
          )}
        </label>

        <div>
          Galleries to submit portfolio to:
          {galleryOptions.map((gallery) => (
            <label key={gallery.name} className="galleryCheckboxLabel">
              <input
                type="checkbox"
                name="galleries"
                value={gallery.name}
                checked={form.GalleriesToSubmit.some(
                  (g) => g.name === gallery.name
                )}
                onChange={handleChange}
              />
              {gallery.name}
              <span aria-label={`Location of ${gallery.name}`}>
                ({gallery.location})
              </span>
            </label>
          ))}
          {errors.GalleriesToSubmit && (
            <div className="errorText">
              {errors.GalleriesToSubmit}
            </div>
          )}
        </div>

        <label>
          Image URL:
          <input
            type="text"
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
            readOnly
          />
          {errors.imageURL && (
            <span className="errorTextBlock">
              {errors.imageURL}
            </span>
          )}
        </label>

        {message && (
          <div className={`messageBox ${message.includes("Error") ? "messageError" : "messageSuccess"}`}>
            {message}
          </div>
        )}

        <div className="buttonRow">
          <button
            className="mainDesignBtn"
            onClick={handleSubmit}
            disabled={updating}
          >
            {updating ? "Updating..." : "Modify"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModifyPortfolio;