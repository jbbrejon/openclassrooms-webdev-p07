// SCRIPT DESCRIPTION : sequelize model for users

module.exports = (sequelize, Sequelize) => {
    //Call "define()" method from sequelize module to define model
    const User = sequelize.define("user", {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.STRING,
            allowNull: true
        },
        avatar: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });

    return User;
};