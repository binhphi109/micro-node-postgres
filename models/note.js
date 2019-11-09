'use strict';

var model = (sequelize, DataTypes) => {
  var Note = sequelize.define('note', {
    content: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE
    },
    userId: {
      type: DataTypes.INTEGER
    },
  });

  Note.associate = models => {
    Note.belongsTo(models.User);
  };

  return { Note };
}
  
module.exports = model;
