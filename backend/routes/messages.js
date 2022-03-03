const express = require("express");
const router = express.Router();
const messagesroute = require("../controllers/messages");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");



router.post("/",auth,multer, messagesroute.messageCreate);
router.post("/comments",auth, messagesroute.commentCreate);
router.delete("/:id",auth, messagesroute.deleteMessage);
router.delete("/comments/:id",auth, messagesroute.deleteComment);
router.get("/",auth, messagesroute.allMessage);

module.exports = router;
