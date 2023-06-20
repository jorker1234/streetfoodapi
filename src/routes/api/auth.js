const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const validator = require('../../validators/auth');
const { jwtAuthenticate, localAuthenticate } = require('../authentication');

router.get('/', jwtAuthenticate, authController.signin);
router.post('/signin', validator.signin, localAuthenticate, authController.signin);

module.exports = router;