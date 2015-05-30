'use strict';

var GuideModel = function(sequelize, DataTypes) {
  var Guide = sequelize.define('guide', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Guide.belongsTo(models.user);
        Guide.belongsTo(models.category);
        Guide.hasMany(models.section);
        Guide.hasMany(models.comment);
        Guide.hasOne(models.guideVote);
      }
    }
  });

  return Guide;
};

module.exports = GuideModel;
