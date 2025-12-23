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
 * ✅ Endpoint réel : /sheet/positions
 * Récupère le token LIVE depuis Oracle Cloud
 * Appelle Saxo LIVE
 * Renvoie un CSV pour Google Sheets
 */
app.get('/sheet/positions', async (req, res) => {
  try {
    // 1️⃣ Récupérer le token LIVE depuis Oracle Cloud
    const tokenResponse = await fetch('https://vcn-saxo-public.fr/token_live.json');
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2️⃣ Appeler Saxo LIVE pour récupérer les positions
    const saxoResponse = await fetch(
      'https://gateway.saxobank.com/openapi/port/v1/positions/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const saxoData = await saxoResponse.json();
    const positions = saxoData.Data || [];

    // 3️⃣ Construire le CSV pour Google Sheets
    let csv = 'Symbol,Amount,Value\n';

    positions.forEach(p => {
      const symbol = p.DisplayAndFormat?.Symbol || '';
      const amount = p.Amount || 0;
      const value = p.MarketValue || 0;
      csv += `${symbol},${amount},${value}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);

  } catch (error) {
    res.status(500).send(`Erreur /sheet/positions : ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
