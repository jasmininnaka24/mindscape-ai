module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfLearner: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unclassified', 
    },
    studyProfTarget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Tasks, {
      onDelete: 'cascade',
    })
    User.hasMany(models.StudyMaterials, {
      onDelete: 'cascade',
    })
    User.hasMany(models.QuesAns, {
      onDelete: 'cascade',
    })
    User.hasMany(models.QuesRev, {
      onDelete: 'cascade',
    })
    User.hasMany(models.QuesAnsChoices, {
      onDelete: 'cascade',
    })
    User.hasMany(models.StudyMaterialsCategories, {
      onDelete: 'cascade',
    })
    User.hasMany(models.StudyGroupMembers, {
      onDelete: 'cascade',
    })
  }

  return User;
}
