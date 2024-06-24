// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// In-memory user storage (for simplicity)
let users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin', 8), // Setting admin password to 'admin'
    isAdmin: true // Marking admin user
  }
];

const secretKey = 'your-secret-key';

// Register endpoint (for admin to create new users)
app.post('/api/register', (req, res) => {
  const { email, password, isAdmin } = req.body;

  // Check if the requester is an admin
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ message: 'No token provided' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err || !decoded.isAdmin) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { id: users.length + 1, email, password: hashedPassword, isAdmin };
    users.push(newUser);
    res.status(201).send({ message: 'User created successfully', user: newUser });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
    res.send({ token });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

// Profile endpoint (protected)
app.get('/api/profile', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ message: 'No token provided' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Failed to authenticate token' });
    res.send({ email: decoded.email, isAdmin: decoded.isAdmin });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
