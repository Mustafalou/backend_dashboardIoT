// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 5000;

const {sequelize} = require('./models/db');
const seedAdmin = require('./seeders/seedAdmin');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

const mqttClient = require('./mqttClient');

app.use(cookieParser());
app.use(bodyParser.json());
const corsOptions = {
  origin:[
    "http://localhost:3000",
    "https://c.technivor.net",
  ],
  credentials:true,
} 
app.use(cors(corsOptions));

app.use("/api/auth",authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/projects", projectRoutes);

//Start The Server
sequelize.sync({alter:true, force:false}).then(async () => {
  console.log('Database synced');
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error)=>{
    console.log("unable to sync database:", error);
});
