// SCRIPT DESCRIPTION : Controller for "/api/auth/" (called from ../routes/user.js)

// Module dependencies
const db = require("../models");
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Call user model
const User = db.users;

// Set variable : token string for 'sign()' method of jsonwebtoken
const tokenString = process.env.JSON_WEB_TOKEN;

// CRUD(CREATE) - Set "signup" operations (create new "user" mysql db)
exports.signup = (req, res) => {
    // Call "hash() method from bcrypt module" (arguments : password from post request, rounds to run hash algorythm)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = {
                email: req.body.email,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            };
            // Call "create()" method from sequelize module
            User.create(user)
                .then(user => {
                    res.status(200).json({
                        userId: user.id,
                        // Call sign() method from jsonwebtoken module (arguments : user's id from mysql db, token string, expiration)
                        token: jwt.sign(
                            { userId: user.id },
                            tokenString,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch((error) => {
                    res.status(400).json({ error })
                });
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};

// Set "login" operations (find existing "user" mysql db and check password with bcrypt)

exports.login = (req, res) => {
    const email = req.body.email;
    // Call "findOne()" method from sequelize module
    User.findOne({ where: { email: email } })
        .then(user => {
            // Check if user exists
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }
            // Call "compare()" method from bcrypt module (arguments : password from request, hashed password from MongoDB)
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        // Call sign() method from jsonwebtoken module (arguments : user's id from mysql db, token string, expiration)
                        token: jwt.sign(
                            { userId: user.id },
                            tokenString,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error })
                });
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};

// CRUD(READ) - Set "getOneUser" operations (get "user" from mysql db)
exports.getOneUser = (req, res) => {
    const id = req.params.id;
    // Call "findByPK()" method from sequelize module
    User.findByPk(id)
        .then((user) => {
            res.status(200).json(user)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

// CRUD(UPDATE) - Set "modifyUser" operations (modify "user" in mysqldb)
exports.modifyUser = (req, res) => {
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
                if (!req.body.password) {
                    // Call "update()" method from sequelize module
                    User.update(req.body, { where: { id: id } })
                        .then(() => {
                            res.status(200).json({ message: 'Utilisateur modifié!' })
                        })
                        .catch((error) => {
                            res.status(400).json({ error })
                        });
                } else {
                    // Call "hash() method from bcrypt module" (arguments : password from post request, rounds to run hash algorythm)
                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const user = {
                                email: req.body.email,
                                password: hash,
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                role: req.body.poste,
                            };
                            // Call "update()" method from sequelize module
                            User.update(user, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Mot de passe modifié!' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        })
                        .catch((error) => {
                            res.status(500).json({ error })
                        });
                }
            } else {
                // Call "findByPK()" method from sequelize module
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            if (!req.body.password) {
                                // Call "update()" method from sequelize module
                                User.update(req.body, { where: { id: id } })
                                    .then(() => {
                                        res.status(200).json({ message: 'Utilisateur modifié!' })
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
                            } else {
                                // Call "hash() method from bcrypt module" (arguments : password from post request, rounds to run hash algorythm)
                                bcrypt.hash(req.body.password, 10)
                                    .then(hash => {
                                        const user = {
                                            email: req.body.email,
                                            password: hash,
                                            firstname: req.body.firstname,
                                            lastname: req.body.lastname,
                                            role: req.body.role,
                                        };
                                        // Call "update()" method from sequelize module
                                        User.update(user, { where: { id: id } })
                                            .then(() => {
                                                res.status(200).json({ message: 'Mot de passe modifié!' })
                                            })
                                            .catch((error) => {
                                                res.status(400).json({ error })
                                            });
                                    })
                                    .catch((error) => {
                                        res.status(500).json({ error })
                                    });
                            }
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })

                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};


// CRUD(UPDATE) - Set "modifyUserPicture" operations (modify "user" in mysqldb)
exports.modifyUserPicture = (req, res) => {

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
                let image
                if (req.file) {
                    image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } else {
                    image == null;
                };
                if (image == null) {
                    res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                } else {
                    if (user.avatar != null) {
                        const filename = user.avatar.split('/images/')[1];
                        // Call "unlink()" method from fs to delete picture
                        fs.unlink(`images/${filename}`, () => {
                            const user = {
                                avatar: image,
                            };
                            User.update(user, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Photo modifiée en tant qu\'administrateur!' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        });
                    } else {
                        const user = {
                            avatar: image,
                        };
                        User.update(user, { where: { id: id } })
                            .then(() => {
                                res.status(200).json({ message: 'Photo modifiée en tant qu\'administrateur!' })
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                    }
                }
            } else {
                // Call "findByPK()" method from sequelize module
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            let image
                            if (req.file) {
                                image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                            } else {
                                image == null;
                            };
                            if (image == null) {
                                res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                            } else {
                                if (user.avatar != null) {
                                    const filename = user.avatar.split('/images/')[1];
                                    // Call "unlink()" method from fs to delete picture
                                    fs.unlink(`images/${filename}`, () => {
                                        const user = {
                                            avatar: image,
                                        };
                                        // Call "update()" method from sequelize module
                                        User.update(user, { where: { id: id } })
                                            .then(() => {
                                                res.status(200).json({ message: 'Photo modifiée !' })
                                            })
                                            .catch((error) => {
                                                res.status(400).json({ error })
                                            });
                                    });
                                } else {
                                    const user = {
                                        avatar: image,
                                    };
                                    User.update(user, { where: { id: id } })
                                        .then(() => {
                                            res.status(200).json({ message: 'Photo modifiée !' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                }
                            }
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};

// CRUD(DELETE) - Set "deleteUser" operation (delete "user" from mysql db)
exports.deleteUser = (req, res) => {
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
                if (user.avatar != null) {
                    const filename = user.avatar.split('/images/')[1];
                    // Call "unlink()" method from fs to delete picture
                    fs.unlink(`images/${filename}`, () => {
                        // Call "destroy()" method from sequelize module
                        User.destroy({ where: { id: id } })
                            .then(() => {
                                res.status(200).json({ message: 'Utilisateur supprimé!' })
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                    });
                } else {
                    // Call "destroy()" method from sequelize module
                    User.destroy({ where: { id: id } })
                        .then(() => {
                            res.status(200).json({ message: 'Utilisateur supprimé!' })
                        })
                        .catch((error) => {
                            res.status(400).json({ error })
                        });
                }
            } else {
                // Call "findByPK()" method from sequelize module
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            if (user.avatar != null) {
                                const filename = user.avatar.split('/images/')[1];
                                // Call "unlink()" method from fs to delete picture
                                fs.unlink(`images/${filename}`, () => {
                                    // Call "destroy()" method from sequelize module
                                    User.destroy({ where: { id: id } })
                                        .then(() => {
                                            res.status(200).json({ message: 'Utilisateur supprimé!' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                });
                            } else {
                                // Call "destroy()" method from sequelize module
                                User.destroy({ where: { id: id } })
                                    .then(() => {
                                        res.status(200).json({ message: 'Utilisateur supprimé!' })
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
                            }
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};
// CRUD(READ) - Set "getAllUsers" operation (get all "users" from mysql db)
exports.getAllUsers = (req, res) => {
    const email = req.query.email;
    const condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
    // Call "findAll()" method from sequelize module
    User.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};