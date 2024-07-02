// models/db/userActivityLog.js
module.exports = (sequelize, DataTypes) => {
    const UserActivityLog = sequelize.define('UserActivityLog', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userEmail:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    UserActivityLog.associate = (models) => {
      UserActivityLog.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return UserActivityLog;
  };
  