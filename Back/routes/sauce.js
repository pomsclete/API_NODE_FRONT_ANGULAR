const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//sécurise les API en imopsant l'authentification
router.get('/sauces', auth, sauceCtrl.getAllSauces);
router.post('/sauces', auth, multer, sauceCtrl.createSauce);
router.get('/sauces/:id', auth, sauceCtrl.getSauceById);
router.delete('/sauces/:id', auth, sauceCtrl.deleteSauceById);
router.put('/sauces/:id', auth,multer, sauceCtrl.modifySauceById);
router.post('/sauces/:id/like', auth, sauceCtrl.likeDislikeSauce);

module.exports = router;
