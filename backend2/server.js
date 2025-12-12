const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5050;

// JSON parsing
app.use(express.json());

// API route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

// SPA fallback using a regex that router understands
app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
