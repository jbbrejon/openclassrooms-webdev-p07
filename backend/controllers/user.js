const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const tokenString = process.env.JSON_WEB_TOKEN;

// CRUD(CREATE) - Set "signup" operations
exports.signup = (req, res) => {
    // Call "hash() method from bcrypt module" (arguments : password from post request, rounds to run hash algorythm)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = {
                email: req.body.email,
                password: hash,
                firstname: req.body.firstname,
                name: req.body.name,
            };
            // Create user in dB
            User.create(user)
                .then(user => {
                    res.status(200).json({
                        userId: user.id,
                        //Call sign() method from jsonwebtoken module (arguments : user's id from dB, token string, expiration)
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

//Set "signin" operations
exports.login = (req, res) => {
    const email = req.body.email;
    //Call "findOne() method to check if the user exists" (filter : email from post request)
    User.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }
            //Call "compare()" method from bcrypt module (arguments : password from request, hashed password from dB)
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Le mot de passe saisi est incorrect' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        //Call sign() method from jsonwebtoken module (arguments : user's id from dB, token string, expiration)
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


//CRUD(READ) - Get one user
exports.getOneUser = (req, res) => {
    const id = req.params.id;
    //Call "findByPK() method to get user informations" (filter : id from post request)
    User.findByPk(id)
        .then((user) => {
            res.status(200).json(user)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

//CRUD(READ) - Get All users
exports.getAllUsers = (req, res) => {
    const email = req.query.email;
    const condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
    //Call "findAll() method to get user informations"
    User.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};



/*MODIFIE L'UTILISATEUR
*Contient deux branches principales :
*La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
*La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé l'utilisateur
*Deux sous branches :
*Check si l'utilisateur modifie son mot de passe
*S'il modifie son mot de passe il va être hashé et toutes ses informations peuvent être modifiées sinon toutes les informations sauf le mot de passe seront modifiées
*/


//CRUD(UPDATE) - Modify one user
exports.modifyUser = (req, res) => {
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
                if (!req.body.password) {
                    User.update(req.body, { where: { id: id } })
                        .then(() => {
                            res.status(200).json({ message: "Les informations de l'utilisateur ont été modifiées" })
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
                                firsname: req.body.firstname,
                                name: req.body.name,
                                role: req.body.role,
                            };
                            //Call "update() method to modify user in dB
                            User.update(user, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Le Mot de passe a été modifié!' })
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
                //Call "findByPK() method to get user
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            if (!req.body.password) {
                                //Call "update() method to modify user in dB
                                User.update(req.body, { where: { id: id } })
                                    .then(() => {
                                        res.status(200).json({ message: "Les informations de l'utilisateur ont été modifiées" })
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
                                            name: req.body.name,
                                            role: req.body.role,
                                        };
                                        //Call "update() method to modify user in dB
                                        User.update(user, { where: { id: id } })
                                            .then(() => {
                                                res.status(200).json({ message: 'Le mot de passe a été modifié!' })
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
                            res.status(401).json({ message: 'Opération non autorisée pour cet utilisateur' })

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

/*MODIFIE L'IMAGE DE L'UTILISATEUR
*Contient deux branches principales :
*La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
*La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé l'utilisateur
*Deux sous branches :
*Check si l'utilisateur a une photo de profil ou non
*Si une image existe déjà elle est supprimée du fichier "images" et remplacée par la nouvelle sinon la nouvelle image est simplement créée
*/

//CRUD(UPDATE) - Modify one user (avatar)
exports.modifyUserPicture = (req, res) => {

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
                    if (user.avatar != null) {
                        const filename = user.avatar.split('/images/')[1];
                        //Call unlink() method to delete picture
                        fs.unlink(`images/${filename}`, () => {
                            const user = {
                                avatar: image,
                            };
                            //Call "update() method to modify user in dB
                            User.update(user, { where: { id: id } })
                                .then(() => {
                                    res.status(200).json({ message: 'Avatar modifié' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        });
                    } else {
                        const user = {
                            avatar: image,
                        };
                        //Call "update() method to modify user in dB
                        User.update(user, { where: { id: id } })
                            .then(() => {
                                res.status(200).json({ message: 'Avatar modifié' })
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                    }
                }
            } else {
                //Call "findByPK() method to get user
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
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
                                if (user.avatar != null) {
                                    rl
                                    const filename = user.avatar.split('/images/')[1];
                                    //Call unlink() method to delete picture
                                    fs.unlink(`images/${filename}`, () => {
                                        const user = {
                                            avatar: image,
                                        };
                                        User.update(user, { where: { id: id } })
                                            .then(() => {
                                                res.status(200).json({ message: 'Avatar modifiée !' })
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
                                            res.status(200).json({ message: 'Avatar modifiée !' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                }
                            }
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée pour cet utilisateur' })
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

/*SUPPRIME L'UTILISATEUR
*Contient deux branches principales :
*La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la suppression
*La seconde vérifie si l'utilisateur qui demande la suppression est bien celui qui a créé l'utilisateur
*Deux sous branches :
*Check si l'utilisateur a une photo de profil ou non
*Si une image existe déjà elle est supprimée du fichier "images" puis l'utilisateur est supprimé sinon seul l'utilisateur est supprimé
*/

//CRUD(DELETE) - Delete one user
exports.deleteUser = (req, res) => {
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
                if (user.avatar != null) {
                    const filename = user.avatar.split('/images/')[1];
                    //Call unlink() method to delete picture
                    fs.unlink(`images/${filename}`, () => {
                        User.destroy({ where: { id: id } })
                            .then(() => {
                                res.status(200).json({ message: 'Utilisateur supprimé' })
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                    });
                } else {
                    //Call destroy() method to delete user from dB
                    User.destroy({ where: { id: id } })
                        .then(() => {
                            res.status(200).json({ message: 'Utilisateur supprimé' })
                        })
                        .catch((error) => {
                            res.status(400).json({ error })
                        });
                }
            } else {
                //Call "findByPK() method to get user
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            if (user.avatar != null) {
                                const filename = user.avatar.split('/images/')[1];
                                //Call unlink() method to delete picture
                                fs.unlink(`images/${filename}`, () => {
                                    User.destroy({ where: { id: id } })
                                        .then(() => {
                                            res.status(200).json({ message: 'Utilisateur supprimé!' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                });
                            } else {
                                //Call destroy() method to delete user from dB
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