module.exports = (sequelize, DataTypes) => {
  const StudyGroup = sequelize.define("StudyGroup", {
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  StudyGroup.associate = (models) => {
    StudyGroup.belongsTo(models.User, {
      foreignKey: {
        name: 'UserId',
        allowNull: false,
        onDelete: 'NO ACTION',
      },
    });

    StudyGroup.hasMany(models.StudyGroupMembers, {
      onDelete: 'cascade',
    })
    StudyGroup.hasMany(models.StudyMaterialsCategories, {
      onDelete: 'cascade',
    })
    StudyGroup.hasMany(models.StudyMaterials, {
      onDelete: 'cascade',
    })
  }

  return StudyGroup;
}