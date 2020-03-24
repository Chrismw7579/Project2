/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
module.exports = function(sequelize, DataTypes) {
	var Info = sequelize.define("Info", {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false
		},
		interest: {
			type: DataTypes.STRING,
			allowNull: false
		},
		aboutMe: {
			type: DataTypes.TEXT
		},
		available: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	});

	Info.associate = function(models){
		Info.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			},
			onDelete: "cascade"
		});
	};
	return Info;
};