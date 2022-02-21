const express = require("express"); //toujours besoin d'express avant de créer un routeur
const router = express.Router(); //on enregistre les routes dans notre routeur Express(on vient de créer), puis enregistrer celui-ci dans l'application
const useroutes = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post('/signup', multer, useroutes.signup);
router.post("/login", useroutes.login);
router.get("/all", auth, useroutes.allProfilUser);
router.delete("/delete", auth, useroutes.suppressionProfile);

module.exports = router;