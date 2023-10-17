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
    response_state: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Unattempted',
    },
    stoppedAt: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '0',
    },
  });

  QuesAns.associate = (models) => {
    QuesAns.hasMany(models.QuesAnsChoices, {
      onDelete: 'cascade',
    })
  }

  return QuesAns;
}