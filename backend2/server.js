const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5050;
const upload = multer();

// JSON parsing
app.use(express.json());

//URLS
const IUPS = 'https://prod-20.francecentral.logic.azure.com/workflows/ffa48415101c463d838e7f244fdc46a5/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=4fbN99TDohZK8kCvqzjESKDKqTH53qICOCfrHseIgo0';
const RAI_img = 'https://prod-13.francecentral.logic.azure.com/workflows/559aab9f292b42f8a2cffa26bc751fb8/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=uhqZeI8RNplqZp2u6MMltaAG12Xx04fwwUxUOivrQUU';
const RAI_resize = 'https://prod-04.francecentral.logic.azure.com/workflows/fb566b95a23d4ec29968620e9e3ac1ce/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios/resized?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ppSBz4ZpPbhscOWtfyv2BB1n5eKjz5EoLX5y6fbQ1Lw';

//URLS that need an ID
const RIA = 'https://prod-30.francecentral.logic.azure.com/workflows/f85b4b7f3c5242ed9071d637c88655b3/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios/%7Bid%7D?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=l3H3ZVY3d6ziN1tLBiMEMIQMhEPCTJwseMgs2hE65eY';
const DIA = 'https://prod-20.francecentral.logic.azure.com/workflows/d0c6ab7585444654a64e8830b91d7904/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios/%7Bid%7D?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=dgtbkkiGPLEgvKYvFxX-p1QkKeoOuLayKWYDMCUVE_4';
const UIA = 'https://prod-27.francecentral.logic.azure.com/workflows/038656af3bfa4e03b3d15e0f33cc1578/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios/%7Bid%7D?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=EbayWMr9NmADa8pdqCi8IVxpHKclIHW8BxgNT4vpR2Y';


//IUPS
app.post("/api/v1/portfolios", upload.any(), async (req, res) => {
  try {
    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    
    // Re-append all files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }
    
    // Re-append all form fields
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });
    
    // Proxy to Azure Logic App using axios (only for this endpoint)
    const response = await axios.post(IUPS, formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    res.status(200).json(response.data);
    
  } catch (error) {
    console.error('Error creating portfolio:', error);
    
    // Handle axios errors
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Azure Logic App error',
        message: error.response.data 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create portfolio',
        message: error.message 
      });
    }
  }
});


//RAI -images
app.get("/api/v1/portfolios", async (req, res) => {
  const response = await fetch(RAI_img);
  const data = await response.json();
  res.json(data);
});

//RAI -resized images
app.get("/api/v1/portfolios/resized", async (req, res) => {
  const response = await fetch(RAI_resize);
  const data = await response.json();
  res.json(data);
});

//RIA
app.get("/api/v1/portfolios/:id", async (req, res) => {
  try {
    const url = RIA.replace('%7Bid%7D', encodeURIComponent(req.params.id));
    console.log('Fetching URL:', url); // Debug log
    console.log('Portfolio ID:', req.params.id); // Debug log
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to fetch portfolio',
      message: error.message 
    });
  }
});

//UIA
app.put("/api/v1/portfolios/:id", upload.any(), async (req, res) => {
  try {
    const FormData = require('form-data');
    const axios = require('axios');
    const cleanId = req.params.id.trim();
    const url = UIA.replace('%7Bid%7D', encodeURIComponent(cleanId));
    const formData = new FormData();
    
    // Re-append files if present (optional for update)
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }
    
    // Re-append all form fields
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });
    
    // Send to Azure Logic App using axios
    const response = await axios.request({
  url,
  method: 'PUT',
  data: formData,
  headers: { ...formData.getHeaders() },
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

    
    res.json(response.data);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Azure Logic App error',
        message: error.response.data 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to update portfolio',
        message: error.message 
      });
    }
  }
});

//DIA
app.delete("/api/v1/portfolios/:id", async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    const url = DIA.replace('%7Bid%7D', encodeURIComponent(cleanId));
    const response = await fetch(url, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response has content before parsing JSON
    const text = await response.text();
    const data = text ? JSON.parse(text) : { success: true, message: 'Portfolio deleted successfully' };
    
    res.json(data);
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to delete portfolio',
      message: error.message 
    });
  }
});


const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

// SPA fallback using a regex that router understands
app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});