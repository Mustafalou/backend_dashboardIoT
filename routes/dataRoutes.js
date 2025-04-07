const express = require("express");
const router = express.Router();
const influx = require("../influxClient");

// Get data from InfluxDB
// on crée une route
router.get("/test", async (req, res) => {
  try {
    const result = await influx.query(`
      SELECT * FROM test_data
      ORDER BY time DESC
      LIMIT 100
    `); // ici ca fait une requete influxQL qui lit les 100 derniers lignes de la measurement de "test_data" et ca trie par time décroissant
    res.json(result.reverse()); // on envoie au client en utilisant la méthode reverse() pour remettre dans l'ordre au plus ancien au plus récent
  } catch (error) {
    console.error("Error fetching data from InfluxDB:", error);
    res.status(500).json({ error: "Internal Server Error" }); // si error alors catch message error au --> console.log + envoie au client
  }
});

module.exports = router; // on export pour l'utiliser dans le server.js
