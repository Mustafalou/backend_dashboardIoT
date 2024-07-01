// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const saltRounds = 10;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
const corsOptions = {
  origin:[
    "http://localhost:3000",
    "http://c.technivor.net",
  ],
  credentials:true,
} 
app.use(cors(corsOptions));


// In-memory user storage (for simplicity)
let users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: bcrypt.hashSync("admin",saltRounds), // Setting admin password to 'admin'
    isAdmin: true
  }
];
let projects = [{
  "name":"yolo",
  "description":"it's ok this is just a test"
}];

const secretKey = 'your-secret-key';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accesToken;
  if (token == null ) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// Register endpoint (for admin to create new users)
app.post('/api/users/create', (req, res) => {
  try{
    const { email, password, isAdmin } = req.body;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = { id: users.length + 1, email, password: hashedPassword, isAdmin };
    users.push(newUser);
    res.status(201).send({ message: 'User created successfully', user: newUser });
  }catch(error){
    res.status(500).send("internal error")
  }
  
});

// Endpoint to verify user session and return user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  // Return user information, excluding the password for security
  const { password, ...userInfo } = user;
  console.log(userInfo)
  res.send(userInfo);
});
// Login endpoint
// Example login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Generate JWT
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
      res.cookie('accesToken', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 3600000 });
      res.send({ message: "Logged in successfully" });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
});
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('accesToken');
  res.send({ message: "Logged out successfully" });
});
function filterSensitiveFields(user){
  const { password, ...userInfo } = user;
  return userInfo;
}
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
  res.status(200).json(projects);
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
