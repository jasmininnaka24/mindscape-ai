module.exports = (sequelize, DataTypes) => {
  const DashRecommendations = sequelize.define("DashRecommendations", {
    recommendation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });


  return DashRecommendations;
}
