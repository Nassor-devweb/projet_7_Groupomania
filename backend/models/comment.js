'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      messageId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      contenu: DataTypes.STRING,
    },
    {}
  );
  Comment.associate = function (models) {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
    }); 
    Comment.belongsTo(models.Message, {
      foreignKey: "messageId",
      onDelete: "CASCADE", 
    });
  };
  return Comment;
}; 