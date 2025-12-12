const express = require('express');
const path = require('path');
const app = express();

// Use the port Azure provides, fallback to 5050 locally
const PORT = process.env.PORT || 5050;

app.use(express.json());

// Serve API route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Serve static frontend files
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

// Catch-all for React Router SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
