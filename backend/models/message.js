'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      titre: DataTypes.STRING,
      contenu: DataTypes.STRING,
      Photo: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {}
  );
  Message.associate = function (models) {Message.belongsTo(models.User); 
  Message.hasMany(models.Comment, { foreignKey: "messageId" },{ onDelete: 'cascade' } );};
  return Message;
};