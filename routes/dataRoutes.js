const express = require('express');
const router = express.Router();
const influx = require('../influxClient');

// Get data from InfluxDB
router.get('/test', async (req, res) => {
  try {
    const result = await influx.query(`
      SELECT * FROM test_data
      ORDER BY time DESC
      LIMIT 100
    `);
    res.json(result.reverse());
  } catch (error) {
    console.error('Error fetching data from InfluxDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
