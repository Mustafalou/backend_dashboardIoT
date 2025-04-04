// controllers/projectController.js
const { Project,ProjectPage, Data } = require('../models/db'); // Adjust the path to import from models/db
const userActivityController = require('./userActivityController');
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
    await userActivityController.logActivity(req.user.userId,req.user.userEmail, 'create', `Project created with name ${name}`);
    res.status(201).send({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
exports.getDroppedItems = async(req,res)=>{
  const { projectId, page } = req.params;

  try {
    const projectPage = await ProjectPage.findOne({
      where: {
        projectId,
        page,
      },
    });
    if (projectPage) {
      res.json(projectPage.droppedItems);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.UpdateDroppedItems = async (req, res) => {
  const { projectId, page } = req.params;
  const { droppedItems } = req.body;

  try {
    const projectPage = await ProjectPage.findOne({
      where: {
        projectId,
        page,
      },
    });

    if (projectPage) {
      projectPage.droppedItems = droppedItems;
      await projectPage.save();
    } else {
      await ProjectPage.create({
        id: `${projectId}-${page}`,
        projectId,
        page,
        droppedItems,
      });
    }

    res.status(201).json({ message: 'Dropped items saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectData = async (req, res) => {
  const { projectId } = req.params;
  const {topics}=req.body;
  try {
    // Find or create the data record associated with the projectId and topicName
    const [data, created] = await Data.findOrCreate({
      where: {
        projectId,
      },
      defaults: {
        projectId,
        data: topics.map(topicName => ({
          topicName,
          minLimit: 0,
          maxLimit: 0,
        })),
      },
      
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateProjectData = async (req, res) => {
  const { projectId } = req.params;
  const { minLimit, maxLimit, topicName } = req.body;

  try {
    let data = await Data.findOne({
      where: {
        projectId
      },
    });
    if (!data) {
      res.status(404).json({ error: 'Data record not found' });
      return;
    }
    // Update the data record with new minLimit and maxLimit values
    data.data.array.forEach(element => {
      if (element.topicName === topicName) {
        element.minLimit = minLimit;
        element.maxLimit = maxLimit;
      }
    });
    await data.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};