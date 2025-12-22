import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { url, options } = req.body;
  try {
    const response = await fetch(url, options);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send(`Proxy error: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
