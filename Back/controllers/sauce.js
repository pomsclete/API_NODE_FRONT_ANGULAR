const sauces = require('../models/sauce');
const fs=require('fs');

//Recuperations des sauces à partir de la base de données
exports.getAllSauces = (req, res, next) => {
  sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

//Créer d'une sauce
exports.createSauce = (req, res, next) => {
  console.log('creating a new sause');
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistée !' }))
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    });
}

// récupération d'une sauce par Id
exports.getSauceById = (req, res, next) => {
  console.log('search for a sause by id');
  sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}

// supprimer une sauce
exports.deleteSauceById = (req, res, next) => {
  sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      }
      else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${ filename }`, () => {
          sauces.deleteOne({ _id: req.params.id })
            .then(sauce => res.status(200).json(sauce))
            .catch(error => res.status(400).json({ error }));
        });
      }
    });

}

// Modifier une sauce
exports.modifySauceById = (req, res, next) => {
  console.log('modify a sause by id');
  const sauceObject = req.file ? // Fichier présent
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // Sans fichier
  sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

// Liker une sauce
exports.likeDislikeSauce = (req, res, next) => {
  console.log('like or dislikea sause');
  if (req.body.like === 1) {
    console.log('like a sause');
    sauces.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
      .then(sauce => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => {
        console.log(error);
        res.status(400).json({ error })
      }) // disliquer une sauce
  } else if (req.body.like === -1) {
    console.log('dislike a sause');
    sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
      .then(sauce => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }))
  }
  else { //Aucun des deux
    sauces.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauces.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
            .then(sauce => { res.status(200).json({ message: 'Like supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          sauces.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
            .then(sauce => { res.status(200).json({ message: 'Dislike supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }))
  }

}