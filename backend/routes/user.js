const express = require("express"); 
const router = express.Router(); 
const useroutes = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post('/signup', multer, useroutes.signup);
router.post("/login", useroutes.login);
router.get("/all", auth, useroutes.allProfilUser);
router.delete("/delete", auth, useroutes.deleteProfile);
router.get("/me", auth, useroutes.infoUser);

module.exports = router;