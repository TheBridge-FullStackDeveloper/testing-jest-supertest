const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();
const { authentication, isAdmin } = require('../middlewares/authentication')

router.post("/", UserController.register);
router.post('/login', UserController.login);
router.get('/confirm/:emailToken',UserController.confirm)
router.get("/", authentication, UserController.getAll);
router.put('/id/:id', authentication, UserController.update)
router.delete("/delete/:id", authentication, isAdmin, UserController.delete);
router.delete('/logout', authentication, UserController.logout);


module.exports = router;
