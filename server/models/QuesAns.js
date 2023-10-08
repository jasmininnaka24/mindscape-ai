module.exports = (sequelize, DataTypes) => {
  const QuesAns = sequelize.define("QuesAns", {
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  QuesAns.associate = (models) => {
    QuesAns.hasMany(models.QuesAnsChoices, {
      onDelete: 'cascade',
    })
  }

  return QuesAns;
}