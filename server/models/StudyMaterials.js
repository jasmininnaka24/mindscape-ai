module.exports = (sequelize, DataTypes) => {
  const StudyMaterials = sequelize.define("StudyMaterials", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    numInp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    materialFor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  StudyMaterials.associate = (models) => {
    StudyMaterials.hasMany(models.QuesAns, {
      onDelete: 'cascade',
    })
    StudyMaterials.hasMany(models.QuesAnsChoices, {
      onDelete: 'cascade',
    })
    StudyMaterials.hasMany(models.QuesRev, {
      onDelete: 'cascade',
    })
  }

  return StudyMaterials;
}