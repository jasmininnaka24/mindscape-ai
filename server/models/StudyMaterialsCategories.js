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
    isShared: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    }
  });

  StudyMaterialsCategories.associate = (models) => {
    StudyMaterialsCategories.belongsTo(models.User, {
      foreignKey: {
        name: 'UserId',
        allowNull: true, // Allow null to remove the association
        onDelete: 'cascade', // or 'SET DEFAULT'
      },
    });
    StudyMaterialsCategories.belongsTo(models.User, {
      foreignKey: {
        name: 'StudyGroupId',
        allowNull: true, // Allow null to remove the association
        onDelete: 'cascade', // or 'SET DEFAULT'
      },
    });


    StudyMaterialsCategories.hasMany(models.StudyMaterials, {
      onDelete: 'cascade',
    })

    StudyMaterialsCategories.beforeDestroy(async (instance, options) => {
      if (instance.isShared === true) {
        options.cascade = false;
      }
    });
  }

  return StudyMaterialsCategories;
}