// SCRIPT DESCRIPTION : Controller for "/api/auth/" (called from ../routes/user.js)

// Module dependencies
const db = require("../models");

const Op = db.Sequelize.Op;
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Call models
const Post = db.posts;
const User = db.users;
const Comment = db.comments;

// Set variable : token string for 'sign()' method of jsonwebtoken
const tokenString = process.env.JSON_WEB_TOKEN;

// CRUD(CREATE) - Set "create post" operations (create new "post" in mysql db)
exports.createPost = (req, res) => {
    let image;
    let text = req.body.text;
    if (req.file) {
        // Set image URL based on filename sent by "multer-config" middleware
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } else {
        image == null
    };
    if (image == null || text == null) {
        res.status(400).json({ error: 'Rien à publier' })
    } else {
        const post = {
            userId: req.body.userId,
            text: text,
            /*La variable image est placée dans une instance de post*/
            imageUrl: image
        };
        // Call "create()" method from sequelize module
        Post.create(post)
            .then((data) => {
                res.send(data);
            })
            .catch((error) => {
                res.status(400).json({ error })
            });
    }
};

// CRUD(READ) - Set "getOnePost" operations (get "post" from mysql db)
exports.getOnePost = (req, res) => {
    const id = req.params.id;
    // Call "findByPK()" method from sequelize module
    Post.findByPk(id)
        .then((post) => {
            res.status(200).json(post)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

// CRUD(READ) - Set "getAllPosts" operations (get "posts" from mysql db)
exports.getAllPosts = (req, res) => {
    const text = req.query.text;
    const condition = text ? { text: { [Op.like]: `%${text}%` } } : null;
    // Call "findAll()" method from sequelize module
    Post.findAll({
        where: condition,
        order: [
            ['createdAt', 'DESC'],
        ]
    })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
};


// CRUD(UPDATE) - Set "modifyPostDescription" operation (modify "post" in mysql db)
exports.modifyPostDescription = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, tokenString);
    // Call "verify()" method from jsonwebtoken module to decode token
    const userId = decodedToken.userId;
    const id = req.params.id;
    const userIdOrder = req.body.userIdOrder;
    // Call "findByPK()" method from sequelize module
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                // Call "update()" method from sequelize module
                Post.update(req.body, { where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Post modifié!' })
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else {
                // Call "findByPK()" method from sequelize module
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            // Call "update()" method from sequelize module
                            Post.update(req.body, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Post modifié!' })
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
// CRUD(UPDATE) - Set "modifyPostPicture" operation (modify "post" in mysql db)
exports.modifyPostPicture = (req, res) => {
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
                // Call "findByPK()" method from sequelize module
                Post.findByPk(id)
                    .then(post => {
                        let image
                        if (req.file) {
                            // Set image URL based on filename sent by "multer-config" middleware
                            image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        } else {
                            image == null;
                        };
                        if (image == null) {
                            res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                        } else {
                            const filename = post.imageUrl.split('/images/')[1];
                            // Call "unlink()" method from fs to delete picture
                            fs.unlink(`images/${filename}`, () => {
                                const post = {
                                    imageUrl: image,
                                };
                                // Call "update()" method from sequelize module
                                Post.update(post, { where: { id: id } })
                                    .then(() => {
                                        res.status(200).json({ message: 'Photo modifiée en tant qu\'administrateur!' })
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            } else {
                // Call "findByPK()" method from sequelize module
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            let image
                            if (req.file) {
                                // Set image URL based on filename sent by "multer-config" middleware
                                image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                            } else {
                                image == null;
                            };
                            if (image == null) {
                                res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                            } else {
                                const filename = post.imageUrl.split('/images/')[1];
                                // Call "unlink()" method from fs to delete picture
                                fs.unlink(`images/${filename}`, () => {
                                    const post = {
                                        imageUrl: image,
                                    };
                                    // Call "update()" method from sequelize module
                                    Post.update(post, { where: { id: id } })
                                        .then(() => {
                                            res.status(200).json({ message: 'Photo modifiée !' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                });
                            }
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

// CRUD(DELETE) - Set "deletePost" operation (delete "post" from mysql db)
exports.deletePost = (req, res) => {
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
                // Call "findByPK()" method from sequelize module
                Post.findByPk(id)
                    .then(post => {
                        const filename = post.imageUrl.split('/images/')[1];
                        // Call "unlink()" method from fs to delete picture
                        fs.unlink(`images/${filename}`, () => {
                            // Call "destroy()" method from sequelize module
                            Post.destroy({ where: { id: id } })
                                .then(() => {
                                    Comment.destroy({ where: { postId: id } })
                                        .then(() => {
                                            res.status(200).json({ message: 'Post et commentaires supprimés en tant qu\'administrateur !' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        });
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            } else {
                // Call "findByPK()" method from sequelize module
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            const filename = post.imageUrl.split('/images/')[1];
                            // Call "unlink()" method from fs to delete picture
                            fs.unlink(`images/${filename}`, () => {
                                // Call "destroy()" method from sequelize module
                                Post.destroy({ where: { id: id } })
                                    .then(() => {
                                        // Call "destroy()" method from sequelize module
                                        Comment.destroy({ where: { postId: id } })
                                            .then(() => {
                                                res.status(200).json({ message: 'Post et Commentaires supprimés !' })
                                            })
                                            .catch((error) => {
                                                res.status(400).json({ error })
                                            });
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
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