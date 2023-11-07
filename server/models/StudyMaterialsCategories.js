module.exports = (sequelize, DataTypes) => {
  const StudyMaterialsCategories = sequelize.define("StudyMaterialsCategories", {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryFor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studyPerformance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
    },
  });

  StudyMaterialsCategories.associate = (models) => {
    StudyMaterialsCategories.hasMany(models.StudyMaterials, {
      onDelete: 'cascade',
    })
  }

  return StudyMaterialsCategories;
}