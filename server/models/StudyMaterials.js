const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
      type: DataTypes.STRING, // Corrected data type
      allowNull: false,
      defaultValue: "false",
    },
    studyPerformance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    tag: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Own Record",
    },
    bookmarkedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    codeDashTrackingNum: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Tracking Num",
    },
  });

  StudyMaterials.associate = (models) => {
    StudyMaterials.belongsTo(models.User, {
      foreignKey: {
        name: "UserId",
        allowNull: true,
        onDelete: "cascade",
      },
    });

    StudyMaterials.belongsTo(models.StudyGroup, {
      foreignKey: {
        name: "StudyGroupId",
        allowNull: true,
        onDelete: "cascade",
      },
    });

    StudyMaterials.hasMany(models.QuesAns, {
      onDelete: "cascade",
    });
    StudyMaterials.hasMany(models.QuesAnsChoices, {
      onDelete: "cascade",
    });
    StudyMaterials.hasMany(models.QuesRev, {
      onDelete: "cascade",
    });
    StudyMaterials.hasMany(models.DashForPersonalAndGroup, {
      onDelete: "cascade",
    });

    StudyMaterials.beforeDestroy(async (instance, options) => {
      if (
        instance.bookmarkedBy !== 0 ||
        instance.materialFor === "Group" ||
        instance.tag === "Shared"
      ) {
        options.cascade = false;
      }
    });
  };

  return StudyMaterials;
};
