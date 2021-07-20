
const express = require('express')
const { getLatestCached, getCryptoInfoAndSave } = require('./crypto');
const app = express();

const INTERVALO_CONSULTA_API_SEGUNDOS = 10;

setInterval(() => getCryptoInfoAndSave(), INTERVALO_CONSULTA_API_SEGUNDOS * 1000)

app.get('/', async (req, res) => {
  const latestInfo = await getLatestCached()
  res.json(latestInfo)
})

app.listen(8001, () => console.log('Servidor na porta 8001'))