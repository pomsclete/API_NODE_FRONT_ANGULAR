const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const { userValidationRules, validate } = require('../middleware/validator')


router.post('/signup', userValidationRules(), validate,userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;
