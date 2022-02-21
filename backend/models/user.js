'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      admin: DataTypes.BOOLEAN,
      profilPhoto: DataTypes.STRING,
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Message,{foreignKey: "userId", onDelete: "CASCADE",});
    User.hasMany(models.Comment,{ foreignKey: "userId" },{ onDelete: "cascade" }); 
  };
  return User;
};