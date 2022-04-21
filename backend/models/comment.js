module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        post_id: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        text: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });

    return Comment;
};