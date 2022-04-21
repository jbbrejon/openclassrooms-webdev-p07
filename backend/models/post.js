module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        user_id: {
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