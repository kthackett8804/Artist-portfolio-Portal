import React, { useState, useEffect } from 'react';
import imageAnalyserModule from '../utils/imageAnalyser';

const { analyzeImageFromUrl } = imageAnalyserModule;

export default function ImageAnalyzerPage() {
  const [allImages, setAllImages] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [ids, setIds] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loadingIds, setLoadingIds] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const BLOB_STORAGE_BASE = "https://storageaccountcw2.blob.core.windows.net";

  const buildBlobUrl = (filePath) => {
    if (!filePath) return "";
    if (/^https?:\/\//i.test(filePath)) return filePath;

    const sasToken =
      "?sp=r&st=2025-12-14T14:07:30Z&se=2026-01-01T22:22:30Z&spr=https&sv=2024-11-04&sr=c&sig=LcFDj6PX6PAqQex9SLNT86L%2Fam%2FBgRXnARlz7IK5K4o%3D";

    return `${BLOB_STORAGE_BASE}/${filePath.replace(/^\/+/g, "")}${sasToken}`;
  };

  useEffect(() => {
    fetchAllIds();
  }, []);

  const fetchAllIds = async () => {
    try {
      setLoadingIds(true);
      const response = await fetch("/api/v1/portfolios");
      if (!response.ok) throw new Error("Failed to fetch portfolios");

      const data = await response.json();
      const ids = data.map(p => p.id).filter(Boolean);

      setIds(ids);
      setAllImages(
        data.map(item => ({
          id: item.id,
          pieceName: item.pieceName,
          artistName: item.artistName,
          imageURL: buildBlobUrl(item.imageURL)
        }))
      );

      if (ids.length) setSelectedId(ids[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingIds(false);
    }
  };

  const selectedImage = allImages.find(img => img.id === selectedId);

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setAnalysisResults(null);
    setMessage('');
    setError(null);

    try {
      const results = await analyzeImageFromUrl(selectedImage.imageURL);
      setAnalysisResults(results);
      setMessage("Analysis complete!");
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingIds) {
    return (
      <div className="pagePadding">
        <h2 className="submittedLabel">Loading images…</h2>
      </div>
    );
  }

  return (
    <div className="pagePadding">
      <h2 className="submittedLabel">Art Analyser</h2>

      <div className="uploadSection">
        {selectedImage && (
          <>
            <img
              src={selectedImage.imageURL}
              alt={selectedImage.pieceName}
              className="uploadImages"
            />
            <p className="id">
              <strong>Piece:</strong> {selectedImage.pieceName}<br />
              <strong>Artist:</strong> {selectedImage.artistName}
            </p>
          </>
        )}
      </div>

      <div className="formSection">
        <label>
          ID:
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            <option value="">-- Select an ID --</option>
            {ids.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </label>

        <button
          className="mainDesignBtn"
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing ? "Analysing..." : "Analyse Artwork"}
        </button>

        {message && (
          <div className={`messageBox messageSuccess`}>
            {message}
          </div>
        )}

        {error && (
          <div className={`messageBox messageError errorText`}>
            {error}
          </div>
        )}

        {analysisResults && (
          <div className="formSection">
            <h3>Analysis Results</h3>

            {analysisResults.caption && (
              <>
                <h4>Caption</h4>
                <p>{analysisResults.caption.text}</p>
              </>
            )}

            {analysisResults.tags?.length > 0 && (
              <>
                <h4>Tags</h4>
                <p>
                  {analysisResults.tags.map((t, i) => (
                    <span key={i}>{t.name} ({Math.round(t.confidence * 100)}%) </span>
                  ))}
                </p>
              </>
            )}

            <h4>People Detected</h4>
            <p><strong>Total:</strong> {analysisResults.peopleCount}</p>

            {analysisResults.text?.length > 0 && (
              <>
                <h4>Detected Text</h4>
                {analysisResults.text.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
