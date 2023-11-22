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
    isStarted: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'false',
    },
    studyPerformance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
    },
    tag: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Own Record',
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
    StudyMaterials.hasMany(models.DashForPersonalAndGroup, {
      onDelete: 'cascade',
    })
  }

  return StudyMaterials;
}