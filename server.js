// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
const corsOptions = {
  origin:"http://localhost:3000",
  credentials:true,
} 
app.use(cors(corsOptions));

// In-memory user storage (for simplicity)
let users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin', 8), // Setting admin password to 'admin'
    isAdmin: true // Marking admin user
  }
];
let projects = [];

const secretKey = 'your-secret-key';

// Register endpoint (for admin to create new users)
app.post('/api/users/create', (req, res) => {
  try{
    const { email, password, isAdmin } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { id: users.length + 1, email, password: hashedPassword, isAdmin };
    users.push(newUser);
    res.status(201).send({ message: 'User created successfully', user: newUser });
  }catch(error){
    res.status(500).send("internal error")
  }
  
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    res.send({message:"success"});
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});
app.post('/api/auth/logout',(req,res)=>{
  res.status(200).send('Logged out successfully');
})

const filterSensitiveFields = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

app.get('/api/users',(req,res)=>{
  const usersWithoutPasswords = users.map(user => filterSensitiveFields(user));
  res.json(usersWithoutPasswords);
})
// Delete user endpoint
app.delete('/api/users/:id', (req, res) => {
  
  const { id } = req.params;
  console.log(id)
    try{
      const userIndex = users.findIndex(user => user.id === parseInt(id));
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).send({ message: 'User deleted successfully' });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    }catch(error){
      res.status(500).send("internal error")
    }
});

// Get all projects endpoint
app.get('/api/projects', (req, res) => {
  res.json(projects);
});
// Create new project endpoint
app.post('/api/projects', (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = { id: projects.length + 1, name, description };
    projects.push(newProject);
    res.status(201).send({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).send("Internal error");
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
