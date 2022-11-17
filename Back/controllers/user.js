//Construire le parcours utilisateur
const bcrypt = require('bcrypt');
const utilisateur = require('../models/utilisateur');

const jwt = require('jsonwebtoken');

//Créer un compte 
exports.signup = (req, res, next) => {
    /* utilisateur.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(401).json({ message: 'Utilisateur existant' });
            }
        }); */
    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            const user = new utilisateur({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    console.log('error==', error);

                    res.status(400).json({ error })
                });
        })
        .catch(error => {
            console.log('error==', error);
            res.status(500).json({ error })
        });
};
// Se connecter 
exports.login = (req, res, next) => {
    utilisateur.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        // Disposer d'un token valide qui dure 24h
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRETTTTT',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};