const express = require('express')
const router = express.Router()
const emailController = require('../controllers/emailController')


router.route("/resetPassword").post(emailController.sendEmail);

router.route("/emailContacto").post(emailController.sendEmailContacto);

router.route("/genericEmail").post(emailController.sendGenericEmail);

module.exports = router


