import React, { useState, useEffect } from 'react';
import imageAnalyserModule from '../utils/imageAnalyser';
const { analyzeImageFromUrl } = imageAnalyserModule;

export default function ImageAnalyzerPage() {
  const [allImages, setAllImages] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [ids, setIds] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const BLOB_STORAGE_BASE = "https://storageaccountcw2.blob.core.windows.net";

  const buildBlobUrl = (filePath) => {
    if (!filePath) return "";
    const trimmed = String(filePath).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    let blobPath = trimmed.replace(/^\/+/g, "");
    const sasToken = "?sp=r&st=2025-12-14T14:07:30Z&se=2026-01-01T22:22:30Z&spr=https&sv=2024-11-04&sr=c&sig=LcFDj6PX6PAqQex9SLNT86L%2Fam%2FBgRXnARlz7IK5K4o%3D";
    return `${BLOB_STORAGE_BASE}/${blobPath}${sasToken}`;
  };

  useEffect(() => {
    fetchAllIds();
  }, []);

  const fetchAllIds = async () => {
    try {
      setLoadingIds(true);
      const response = await fetch("/api/v1/portfolios");
      if (!response.ok) throw new Error(`Failed to fetch portfolios: ${response.status}`);
      const data = await response.json();

      const ids = Array.isArray(data) ? data.map(p => p.id).filter(Boolean) : [];
      setIds(ids);

      setAllImages(data.map(item => ({
        id: item.id,
        pieceName: item.pieceName,
        artistName: item.artistName,
        imageURL: buildBlobUrl(item.imageURL)
      })));

      if (ids.length > 0) setSelectedId(ids[0]);
    } catch (error) {
      console.error("Error fetching portfolio IDs:", error);
      setMessage(`Error loading IDs: ${error.message}`);
    } finally {
      setLoadingIds(false);
    }
  };

  const handleChange = (event) => {
    setSelectedId(event.target.value);
    setAnalysisResults(null);
    setError(null);
    setMessage('');
  };

  const selectedImage = allImages.find(img => img.id === selectedId);

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setMessage('Please select an image');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setMessage('');
    setAnalysisResults(null);

    try {
      const results = await analyzeImageFromUrl(selectedImage.imageURL);
      setAnalysisResults(results);
      setMessage('Analysis complete!');
    } catch (err) {
      setError(err.message || 'Failed to analyze image');
      setMessage(`Error: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingIds) {
    return (
      <div className="pagePadding">
        <h2 className="submittedLabel">Loading images...</h2>
      </div>
    );
  }

  if (error && allImages.length === 0) {
    return (
      <div className="pagePadding">
        <h2 className="submittedLabel">Error loading images</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button 
          onClick={fetchAllIds}
          className="mainDesignBtn"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pagePadding">
      <h2 className="submittedLabel">Art Analyser</h2>

      <div className="uploadSection">
      </div>


      <div className="formSection">
        <label>
          ID:
          <select
            name="id"
            value={selectedId}
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
        </label>

        {selectedImage && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <img
                src={selectedImage.imageURL}
                alt={selectedImage.pieceName}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: 8
                }}
              />
              <p style={{ fontSize: 14, color: '#666' }}>
                <strong>Piece:</strong> {selectedImage.pieceName} | <strong>Artist:</strong> {selectedImage.artistName}
              </p>
            </div>

            <button className="mainDesignBtn" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? 'Analysing...' : 'Analyse Artwork'}
            </button>
          </>
        )}

        {message && (
          <div style={{ margin: "10px 0", padding: 10, backgroundColor: message.includes("Error") ? "#fee" : "#efe" }}>
            {message}
          </div>
        )}

        {analysisResults && (
          <div style={{ marginTop: 30 }}>
            <h3 style={{ fontSize: 24, fontWeight: 'bold' }}>Analysis Results</h3>

            {analysisResults.caption && (
              <div style={{ borderBottom: '1px solid #ddd', paddingBottom: 20 }}>
                <h4>Caption</h4>
                <p>{analysisResults.caption.text}</p>
                <p style={{ color: '#666' }}>
                  Confidence: {(analysisResults.caption.confidence * 100).toFixed(1)}%
                </p>
              </div>
            )}

            {analysisResults.tags?.length > 0 && (
              <div style={{ borderBottom: '1px solid #ddd', paddingBottom: 20 }}>
                <h4>Tags</h4>
                {analysisResults.tags.map((tag, i) => (
                  <span key={i} style={{ marginRight: 8 }}>
                    {tag.name} ({(tag.confidence * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            )}

            {/* PEOPLE */}
            <div style={{ borderBottom: '1px solid #ddd', paddingBottom: 20 }}>
              <h4>People Detected</h4>
              <p><strong>Total:</strong> {analysisResults.peopleCount}</p>
              <ul>
                {analysisResults.people.map((p, i) => (
                  <li key={i}>
                    Confidence: {(p.confidence * 100).toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>

            {analysisResults.text?.length > 0 && (
              <div>
                <h4>Detected Text</h4>
                {analysisResults.text.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
