// controllers/projectController.js
const { Project } = require('../models/db'); // Adjust the path to import from models/db

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = await Project.create({ name, description });
    res.status(201).send({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
