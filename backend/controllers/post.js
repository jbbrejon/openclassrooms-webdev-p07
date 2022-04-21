const db = require("../models");
const Post = db.posts;
const User = db.users;
const Comment = db.comments;
const Op = db.Sequelize.Op;
const fs = require('fs');
const jwt = require('jsonwebtoken');

const tokenString = process.env.JSON_WEB_TOKEN;

// CRUD(CREATE) - Create post
exports.createPost = (req, res) => {
    let image;
    let text = req.body.text;
    if (req.file) {
        // Set new image URL based on filename sent by "multer-config" middleware
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } else {
        image == null
    };
    if (image == null || text == null) {
        res.status(400).json({ error: 'Votre post est vide' })
    } else {
        const post = {
            user_id: req.body.userId,
            text: text,
            imageUrl: image
        };
        // Call create() method to create user in dB
        Post.create(post)
            .then((data) => {
                res.send(data);
            })
            .catch((error) => {
                res.status(400).json({ error })
            });
    }
};

// CRUD(READ) - Get one post
exports.getOnePost = (req, res) => {
    const id = req.params.id;
    // Call findByPk() method to get one post in dB
    Post.findByPk(id)
        .then((post) => {
            res.status(200).json(post)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

// CRUD(READ) - Get all posts
exports.getAllPosts = (req, res) => {
    const text = req.query.text;
    const condition = text ? { text: { [Op.like]: `%${text}%` } } : null;
    // Call findAll() method to get all posts from dB
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


// CRUD(UPDATE) - Modify on post
exports.modifyPostDescription = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Call verify() method from jsonwebtoken module to decode token
    const decodedToken = jwt.verify(token, tokenString);
    //Get user's id from decoded token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;
    //Call "findByPK() method to get user
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                //Call "update() method to update post
                Post.update(req.body, { where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Post modifié' })
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else {
                //Call "findByPK() method to get post
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            //Call "update() method to update post
                            Post.update(req.body, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Post modifié' })
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


exports.modifyPostPicture = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Call verify() method from jsonwebtoken module to decode token
    const decodedToken = jwt.verify(token, tokenString);
    //Get user's id from decoded token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;
    //Call "findByPK() method to get user
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                //Call "findByPK() method to get post
                Post.findByPk(id)
                    .then(post => {
                        let image
                        if (req.file) {
                            // Set new image URL based on filename sent by "multer-config" middleware
                            image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        } else {
                            image == null;
                        };
                        if (image == null) {
                            res.status(400).json({ error: "Votre image n'a pas été soumise" })
                        } else {
                            const filename = post.imageUrl.split('/images/')[1];
                            //Call unlink() method to delete picture
                            fs.unlink(`images/${filename}`, () => {
                                const post = {
                                    imageUrl: image,
                                };
                                //Call "update() method to update post
                                Post.update(post, { where: { id: id } })
                                    .then(() => {
                                        res.status(200).json({ message: 'Photo modifiée !' })
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
                //Call "findByPK() method to get post
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            let image
                            if (req.file) {
                                // Set new image URL based on filename sent by "multer-config" middleware
                                image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                            } else {
                                image == null;
                            };
                            if (image == null) {
                                res.status(400).json({ error: "Votre image n'a pas été soumise" })
                            } else {
                                const filename = post.imageUrl.split('/images/')[1];
                                //Call unlink() method to delete picture
                                fs.unlink(`images/${filename}`, () => {
                                    const post = {
                                        imageUrl: image,
                                    };
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


exports.deletePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Call verify() method from jsonwebtoken module to decode token
    const decodedToken = jwt.verify(token, tokenString);
    //Get user's id from decoded token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;
    //Call "findByPK() method to get user
    User.findByPk(userIdOrder)
        .then(user => {
            if (user.isAdmin == true && user.id == userId) {
                //Call "findByPK() method to get post
                Post.findByPk(id)
                    .then(post => {
                        const filename = post.imageUrl.split('/images/')[1];
                        //Call unlink() method to delete picture
                        fs.unlink(`images/${filename}`, () => {
                            //Call "destroy() method to delete post
                            Post.destroy({ where: { id: id } })
                                .then(() => {
                                    Comment.destroy({ where: { postId: id } })
                                        .then(() => {
                                            res.status(200).json({ message: 'Post et commentaires supprimés' })
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
                //Call "findByPK() method to get post
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            const filename = post.imageUrl.split('/images/')[1];
                            //Call unlink() method to delete picture
                            fs.unlink(`images/${filename}`, () => {
                                //Call "destroy() method to delete post
                                Post.destroy({ where: { id: id } })
                                    .then(() => {
                                        Comment.destroy({ where: { postId: id } })
                                            .then(() => {
                                                res.status(200).json({ message: 'Post et commentaires supprimés !' })
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