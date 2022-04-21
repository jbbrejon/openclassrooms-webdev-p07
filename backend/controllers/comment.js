const db = require("../models");
const Comment = db.comments;
const User = db.users;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');

const tokenString = process.env.JSON_WEB_TOKEN;

// CRUD(CREATE) - Create comment
exports.createComment = (req, res) => {
    let postId = req.body.postId;
    const comment = {
        user_id: req.body.userId,
        post_id: req.body.postId,
        text: req.body.text
    };
    //Call create() method to get comment from db
    Comment.create(comment)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(400).json({ error })
        });

};

// CRUD(READ) - Get one comment
exports.getOneComment = (req, res) => {
    const id = req.params.id;
    //Call findByPK() method to get comment from db
    Comment.findByPk(id)
        .then((comment) => {
            res.status(200).json(comment)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

// CRUD(READ) - Get all comments
exports.getAllComments = (req, res) => {
    const text = req.query.text;
    const condition = text ? { text: { [Op.like]: `%${text}%` } } : null;
    //Call findAll() method to get comment from db
    Comment.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
};

// CRUD(UPDATE) - Modify comment

exports.modifyComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Call verify() method from jsonwebtoken module to decode token
    const decodedToken = jwt.verify(token, tokenString);
    //Get user's id from decoded token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;
    //Call findByPK() method to get comment from db
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                //Call update() method to get comment from db
                Comment.update(req.body, { where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Le commentaire a été modifié' })
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else {
                //Call findByPK() method to get comment from db
                Comment.findByPk(id)
                    .then(comment => {
                        if (comment.userId == userId) {
                            //Call update() method to get comment from db
                            Comment.update(req.body, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Le commentaire a été modifié' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée pour cet utilisateur' })
                        }
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
};

// CRUD(DELETE) - Delete comment

exports.deleteComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Call verify() method from jsonwebtoken module to decode token
    const decodedToken = jwt.verify(token, tokenString);
    //Get user's id from decoded token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;
    //Call findByPK() method to get comment from db
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                //Call destroy() method to get comment from db
                Comment.destroy({ where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Le commentaire a été supprimé' })
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else {
                //Call findByPK() method to get comment from db
                Comment.findByPk(id)
                    .then(comment => {
                        if (comment.userId == userId) {
                            //Call destroy() method to get comment from db
                            Comment.destroy({ where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Le commentaire a été supprimé' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée pour cet utilisateur' })
                        }
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
};