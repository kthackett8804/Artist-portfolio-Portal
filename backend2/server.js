const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5050;
const upload = multer();

// JSON parsing
app.use(express.json());

//URLS
const IUPS = 'https://prod-20.francecentral.logic.azure.com/workflows/ffa48415101c463d838e7f244fdc46a5/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=4fbN99TDohZK8kCvqzjESKDKqTH53qICOCfrHseIgo0';
const RAI_img = 'https://prod-13.francecentral.logic.azure.com/workflows/559aab9f292b42f8a2cffa26bc751fb8/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=uhqZeI8RNplqZp2u6MMltaAG12Xx04fwwUxUOivrQUU';
const RAI_resize = 'https://prod-22.francecentral.logic.azure.com/workflows/1d085096a7994bb2bd1976d5a6c20cc7/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=szMEoWgytlB27bQiI6b4xE_DSMGUKoaEfIg_mU03rCI';

//URLS that need an ID
const RIA = 'https://prod-30.francecentral.logic.azure.com/workflows/f85b4b7f3c5242ed9071d637c88655b3/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios/%7Bid%7D?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=l3H3ZVY3d6ziN1tLBiMEMIQMhEPCTJwseMgs2hE65eY';
const DIA = 'https://prod-20.francecentral.logic.azure.com/workflows/d0c6ab7585444654a64e8830b91d7904/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios/%7Bid%7D?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=dgtbkkiGPLEgvKYvFxX-p1QkKeoOuLayKWYDMCUVE_4';
const UIA = 'https://prod-27.francecentral.logic.azure.com/workflows/038656af3bfa4e03b3d15e0f33cc1578/triggers/When_an_HTTP_request_is_received/paths/invoke/api/v1/portfolios/%7Bid%7D?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=EbayWMr9NmADa8pdqCi8IVxpHKclIHW8BxgNT4vpR2Y';

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

//testing route
app.get("/api/portfolios", async (req, res) => {
  const response = await fetch(RAI_img);
  const data = await response.json();
  res.json(data);
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