// SCRIPT DESCRIPTION : sequelize model for comments

module.exports = (sequelize, Sequelize) => {
    //Call "define()" method from sequelize module to define model
    const Comment = sequelize.define("comment", {
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        topicId: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        postId: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });

    return Comment;
};