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

  const [apiID, setApiID] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const galleryOptions = [
    { name: "Tech Art Gallery", location: "London" },
    { name: "Digital Expressions", location: "New York" },
    { name: "Modern Arts Hub", location: "Berlin" },
  ];

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

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
    } else if (name === "id") {
      setApiID(value);
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleFetch = async () => {
    if (!apiID.trim()) {
      setMessage("Please enter an ID to fetch");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`/api/v1/portfolios/${apiID.trim()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse GalleriesToSubmit if it's a string
      let galleries = data.GalleriesToSubmit;
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

  const handleSubmit = async () => {
    if (!apiID.trim()) {
      setMessage("Please enter an ID to update");
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
          <input
            type="text"
            name="id"
            value={apiID}
            onChange={handleChange}
            placeholder="Enter portfolio ID to fetch"
          />
        </label>

        <div className="buttonRow">
          <button
            className="mainDesignBtn"
            onClick={handleFetch}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Portfolio"}
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
        </label>

        {message && (
          <div
            style={{
              margin: "10px 0",
              padding: "10px",
              backgroundColor: message.includes("Error") ? "#fee" : "#efe",
            }}
          >
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