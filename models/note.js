'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
    content: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER
    },
  });

  Note.associate = models => {
    Note.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Note;
};