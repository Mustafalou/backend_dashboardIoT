module.exports = (sequelize, DataTypes) => {
    const Data = sequelize.define('Data', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return Data;
  };
  