// controllers/userActivityController.js
const {AlertLog} = require('../models/db');

exports.logAlert = async (topic,message) => {
  try {
    await AlertLog.create({ topic,message});
  } catch (error) {
    console.error('Error logging alert:', error);
  }
};
exports.getLogsAlert = async(req,res)=>{
    try{
        const alertLogs = await AlertLog.findAll({
          order:[['timestamp','DESC']],
          limit:10,
        });
        res.status(200).json(alertLogs);
    }catch(err){
        res.status(500).json({error:err});
    }
}
