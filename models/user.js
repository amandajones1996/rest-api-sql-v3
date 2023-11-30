const { Model, DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter a first name'
                },
                notEmpty: {
                    msg: 'A first name must be entered'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter a last name'
                },
                notEmpty: {
                    msg: 'A last name should be entered'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Please enter a email address'
                },
                notNull: {
                    msg: 'A email address needs to be entered'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull:{
                    msg: 'A password must be entered'
                },
                notEmpty:{
                    msg: 'A valid password must be entered'
                }
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'user',
            foreignKey: 'userId'
        });
    };
    return User;
}