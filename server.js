// backend/server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// creation de l'app
const app = express();
const PORT = 5000;

const { sequelize } = require("./models/db");
const seedAdmin = require("./seeders/seedAdmin");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dataRoutes = require("./routes/dataRoutes");
const alertRoutes = require("./routes/alertRoutes");
const mqttClient = require("./mqttClient");
// on active le support cookie et le parsing automatique
app.use(cookieParser());
app.use(bodyParser.json());
//on autorise l'appel depuis localhost:3000 (frontend) et on autorise les cookies dans les requêtes cross-origin (credentials: true)
const corsOptions = {
  origin: [
    "http://localhost:3000",
    //"https://c.technivor.net",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
// on déclare les routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);
// lancement de serveur + sync de DB
//Start The Server
// alter:true ==> adapte les tables aux modèles sans tout casser
// forcde:false ==> ne supprime pas les données existante (très important)
// puis on appelle seedAdmin() pour créer un admin par défaut si aucun n'existe
// puis on demarre le serveur avec app.listen()
sequelize
  .sync({ alter: true, force: false })
  .then(async () => {
    console.log("Database synced");
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("unable to sync database:", error);
  });
