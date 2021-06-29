const express = require("express");
const usersController = require("../controller/users.controller");
const router = express.Router();


router.post('/login',usersController.login);
router.post('/signup/manual',usersController.register);
router.post('/signup/manual/email',usersController.register);
router.post('/signup/manual/mobile',usersController.register);
router.post('/signup/social',usersController.socialRegister);
router.get('/dump',usersController.dump)

module.exports = router;