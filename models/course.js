const { Model, DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg: 'A title must be entered'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A description is required'
                },
                notEmpty: {
                    msg: 'A description must be entered'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING,
        },
        materialsNeeded: {
            type: DataTypes.STRING, 
        }
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
    };
    return Course;
}