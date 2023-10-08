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
  });

  StudyMaterialsCategories.associate = (models) => {
    StudyMaterialsCategories.hasMany(models.StudyMaterials, {
      onDelete: 'cascade',
    })
  }

  return StudyMaterialsCategories;
}