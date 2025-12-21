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

  // Azure Blob Storage account URL base
  const BLOB_STORAGE_BASE = "https://storageaccountcw2.blob.core.windows.net";

  const buildBlobUrl = (filePath) => {
    if (!filePath) return "";
    const trimmed = String(filePath).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed; // already absolute
    
    let blobPath = trimmed.replace(/^\/+/g, "");
    
    const sasToken = "?sp=r&st=2025-12-14T14:07:30Z&se=2026-01-01T22:22:30Z&spr=https&sv=2024-11-04&sr=c&sig=LcFDj6PX6PAqQex9SLNT86L%2Fam%2FBgRXnARlz7IK5K4o%3D";
    
    return `${BLOB_STORAGE_BASE}/${blobPath}${sasToken}`;
  };

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
      
      // Store full data for later use
      setAllImages(data.map(item => ({
        id: item.id,
        pieceName: item.pieceName,
        artistName: item.artistName,
        imageURL: buildBlobUrl(item.imageURL)
      })));

      // Set first image as default selection if available
      if (ids.length > 0) {
        setSelectedId(ids[0]);
      }
    } catch (error) {
      console.error("Error fetching portfolio IDs:", error);
      setMessage(`Error loading IDs: ${error.message}`);
    } finally {
      setLoadingIds(false);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedId(value);
    setAnalysisResults(null); // Clear previous results when changing selection
    setError(null);
    setMessage('');
  };

  const selectedImage = allImages.find(img => img.id === selectedId);

  const handleAnalyze = async () => {
    console.log('Analyze button clicked!');
    console.log('Selected image:', selectedImage);
    
    if (!selectedImage) {
      console.log('No image selected');
      setMessage('Please select an image');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setMessage('');
    setAnalysisResults(null);

    try {
      console.log('Calling analyzeImageFromUrl with:', selectedImage.imageURL);
      const results = await analyzeImageFromUrl(selectedImage.imageURL);
      console.log('Got results:', results);
      setAnalysisResults(results);
      setMessage('Analysis complete!');
    } catch (err) {
      console.error('Error in handleAnalyze:', err);
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
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  console.error("Image failed to load:", selectedImage.imageURL);
                  e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                }}
              />
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                <strong>Piece:</strong> {selectedImage.pieceName} | <strong>Artist:</strong> {selectedImage.artistName}
              </p>
            </div>

            <div className="buttonRow">
              <button
                className="mainDesignBtn"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? 'Analysing...' : 'Analyse Artwork'}
              </button>
            </div>
          </>
        )}

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

        {analysisResults && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              Analysis Results
            </h3>

            {/* Caption */}
            {analysisResults.caption && (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                  Caption
                </h4>
                <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                  {analysisResults.caption.text}
                </p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Confidence: {(analysisResults.caption.confidence * 100).toFixed(1)}%
                </p>
              </div>
            )}

            {/* Tags */}
            {analysisResults.tags && analysisResults.tags.length > 0 && (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                  Tags
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysisResults.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {tag.name} ({(tag.confidence * 100).toFixed(0)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Text (OCR) */}
            {analysisResults.text && analysisResults.text.length > 0 && (
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                  Detected Text
                </h4>
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '15px', 
                  borderRadius: '8px' 
                }}>
                  {analysisResults.text.map((line, index) => (
                    <p key={index} style={{ marginBottom: '5px' }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}