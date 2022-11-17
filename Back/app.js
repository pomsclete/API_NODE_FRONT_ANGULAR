const http = require('http');
const express = require('express');

// Déclaration des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
 //Permet de lire le body de la requête HTTP
const app = express();
const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
//............................
// Ces headers permettent d'accéder à notre API depuis n'importe quelle origine ,ajouter les headers mentionnés , envoyer des requêtes avec les méthodes mentionnées
//des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse.
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

//connexion à la base de données
const mongoose = require('mongoose');
mongoose.connect('',
   {
      useNewUrlParser: true,
      useUnifiedTopology: true
   })
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));


// permet de simplifier les routes
app.use('/api/auth', userRoutes);
app.use('/api', sauceRoutes);

// Pour Sauvegarder l'image en local
const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;