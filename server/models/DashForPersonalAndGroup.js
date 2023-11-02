module.exports = (sequelize, DataTypes) => {
  const DashForPersonalAndGroup = sequelize.define("DashForPersonalAndGroup", {
    dashFor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overAllItems: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    },
    preAssessmentScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    },
    assessmentScore: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'none',
    },
    assessmentImp: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'none',
    },
    assessmentScorePerf: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'none',
    },
    completionTime: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'none',
    },
    confidenceLevel: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'none',
    },
    numOfTakes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, 
    },    
  });

  DashForPersonalAndGroup.associate = (models) => {
    DashForPersonalAndGroup.hasMany(models.DashRecommendations, {
      onDelete: 'cascade',
    })
  }

  return DashForPersonalAndGroup;
}
