/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
module.exports = function (sequelize, DataTypes) {
	var Room = sequelize.define("Room", {
		guest: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	Room.associate = function(models){
		Room.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			},
			onDelete: "cascade"
		});
	};
	Room.associate = function(models){
		Room.hasOne(models.Message);
	};
	return Room;
};