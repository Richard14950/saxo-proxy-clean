import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * 🔁 Endpoint principal : proxy POST
 * Utilisé pour relayer les requêtes vers Saxo avec options personnalisées
 */
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

/**
 * ✅ Nouveau endpoint GET : /sheet/positions
 * Utilisé pour tester depuis Google Sheets avec IMPORTDATA
 * Réponse simple pour valider le fonctionnement
 */
app.get('/sheet/positions', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send("OK - endpoint positions fonctionne");
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
