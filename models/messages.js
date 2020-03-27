/* eslint-disable no-undef */
// this model will store the messages for each room, and will be accessed whenever a user joins 
// the room allowing for persistant infinite data storage
module.exports = function (sequelize, DataTypes) {
	var Message = sequelize.define('Message', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		data: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	Message.associate = function(models){
		Message.belongsTo(models.Room, {
			foreignKey: {
				allowNull: false
			},
			onDelete: 'cascade'
		});
	};
	return Message;
};