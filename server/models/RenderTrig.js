const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RenderTrig = sequelize.define("RenderTrig", {
    trig: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return RenderTrig;
};
