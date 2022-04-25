// SCRIPT DESCRIPTION : Controller for "/api/auth/" (called from ../routes/user.js)

// Module dependencies
const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');

// Calls models
const Comment = db.comments;
const User = db.users;

// Set variable : token string for 'sign()' method of jsonwebtoken
const tokenString = process.env.JSON_WEB_TOKEN;

// CRUD(CREATE) - Set "create comment" operations (create new "comment" in mysql db)
exports.createComment = (req, res) => {
    let postId = req.body.postId;
    const comment = {
        userId: req.body.userId,
        postId: req.body.postId,
        content: req.body.content
    };
    if (postId == null) {
        res.status(400).json({ error: 'Ce n\'est pas la bonne section' })
    } else {
        // Call "create()" method from sequelize module
        Comment.create(comment)
            .then((data) => {
                res.send(data);
            })
            .catch((error) => {
                res.status(400).json({ error })
            });
    }
};

// CRUD(READ) - Set "getOneComment" operations (get "comment" from mysql db)
exports.getOneComment = (req, res) => {
    const id = req.params.id;
    // Call "findByPK()" method from sequelize module
    Comment.findByPk(id)
        .then((comment) => {
            res.status(200).json(comment)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

// CRUD(READ) - Set "getAllComments" operations (get "comments" from mysql db)
exports.getAllComments = (req, res) => {
    const content = req.query.content;
    const condition = content ? { content: { [Op.like]: `%${content}%` } } : null;
    // Call "findAll()" method from sequelize module
    Comment.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
};

// CRUD(UPDATE) - Set "modifyPostDescription" operation (modify "post" document in mysql db)
exports.modifyComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    // Call "verify()" method from jsonwebtoken module to decode token
    const decodedToken = jwt.verify(token, tokenString);
    const userId = decodedToken.userId;
    const id = req.params.id;
    const userIdOrder = req.body.userIdOrder;
    // Call "findByPK()" method from sequelize module
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                // Call "update()" method from sequelize module
                Comment.update(req.body, { where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Commentaire modifié en tant qu\'administrateur !' })
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else {
                // Call "findByPK()" method from sequelize module
                Comment.findByPk(id)
                    .then(comment => {
                        if (comment.userId == userId) {
                            // Call "update()" method from sequelize module
                            Comment.update(req.body, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Commentaire modifié !' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
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

// CRUD(DELETE) - Set "deleteComment" operation (delete "comment" from mysql db)
exports.deleteComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    // Call "verify()" method from jsonwebtoken module to decode token
    const decodedToken = jwt.verify(token, tokenString);
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;
    // Call "findByPK()" method from sequelize module
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                Comment.destroy({ where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Commentaire supprimé en tant qu\'administrateur !' })
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else {
                // Call "findByPK()" method from sequelize module
                Comment.findByPk(id)
                    .then(comment => {
                        if (comment.userId == userId) {
                            Comment.destroy({ where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Commentaire supprimé !' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
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