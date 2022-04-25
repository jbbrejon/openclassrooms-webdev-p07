// SCRIPT DESCRIPTION : sequelize model for posts

module.exports = (sequelize, Sequelize) => {
    //Call "define()" method from sequelize module to define model
    const Post = sequelize.define("post", {
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        text: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });

    return Post;
};