let models = require("../models");
const fs = require("fs");
const { json } = require("body-parser");
const jwt = require('jsonwebtoken');
const Users = models.User;
const Message = models.Message;
const Comment = models.Comment;

exports.messageCreate = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log(userId);

    let Photolink;
    
    if (req.file) {
      Photolink = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    } else {
        Photolink == null;
    }
    
    if (req.file){
        if (req.file.mimetype != "image/jpeg" && req.file.mimetype != "image/png" && req.file.mimetype != "image/gif" && req.file.mimetype != "image/jpg"){
          return res.status(400).json({ message: "Le format de l’image est non pris en charge" });
        }
    } 
    

    if (req.body.contenu == 'null' && req.body.inputFile == 'null') {
      return res.status(400).json({ error: "Veuillez saisir au moins une image ou un message" });
    }

    Users.findOne({where: { id: userId }})
    .then((searchUserId) => {
       if (!searchUserId){ return res.status(500).json({ message: 'utilisateur introuvable'})};
       const msg = {
            userId: searchUserId.id,
            titre: req.body.titre,
            contenu: req.body.contenu,
            Photo: Photolink, 
            likes: 0,
        };
        Message.create(msg)
                .then(() => res.status(201).json({message: 'message créé !'}))
                .catch(() => res.status(400).json({message: 'impossible de créer le message !'}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.commentCreate = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Comment.create({
      messageId: req.body.messageId,
      userId: userId,
      contenu: req.body.contenu,
    })
    .then((comment ) => res.status(201).json({ comment }))
    .catch((error) => res.status(400).json({message: 'commentaire non créé'}));
  };

exports.deleteMessage = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let userIdMsg = req.body.userIdMsg;
    Users.findOne({ attributes: ["id", "email", "username", "admin"],
    where: { id: userId },})
    .then((user) => {
        if (user && (user.admin == true || user.id == userIdMsg)) {
          Message.findOne({where: { id: req.params.id },})
            .then((postFind) => {
              if (postFind.Photo) {

                const filename = postFind.Photo.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                  Comment.destroy({ where: { messageId: postFind.id },}),
                  models.Message.destroy({where: { id: postFind.id },})
                    .then(() => res.end())
                    .catch((err) => res.status(500).json(err));});
                } else {
                models.Comment.destroy({where: { messageId: postFind.id }}),
                models.Message.destroy({where: { id: postFind.id },})
                  .then(() => res.end())
                  .catch((err) => res.status(500).json(err));}
                })
            .catch((err) => res.status(500).json(err));
        } else {
          res.status(403).json("Utilisateur non autorisé à supprimer ce post");
        }
    })
    .catch((error) => res.status(500).json(error));
};

exports.deleteComment = (req, res, next) => { 
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let userIdComment = req.body.userIdComment;
    Users.findOne({attributes: ["id", "email", "username", "admin"],where: { id: userId },})
    .then((user) => {
        if (user && (user.admin == true || user.id == userIdComment)) {
          Comment.findOne({where: { id: req.params.id },})
            .then((postFind) => {
                Comment.destroy({where: { id: postFind.id },})
                  .then(() => res.end())
                  .catch((err) => res.status(500).json(err));})
            .catch((err) => res.status(500).json(err));
        } else {
          res.status(403).json("Utilisateur non autorisé à supprimer ce commentaire");
        }})
    .catch((error) => res.status(500).json({message: 'user introuvable'}));
};

exports.allMessage = (req, res, next) => {
    Message.findAll({ 
      include: [{model: Users, attributes: ["id", "username", "admin", "profilPhoto"]},
        {model: Comment,
          attributes: ["id", "messageId", "userId", "contenu","createdAt"], include: [{model: Users, attributes: ["id", "username"] }]
        },
      ],
      order: [["createdAt", "DESC"]],}) 
      .then((messages) => {
        if (messages.length > null) {
          res.status(200).json(messages); 
        } else {
          res.status(404).json({ error: "Pas de post à afficher" });
        }
      })
      .catch((err) => res.status(500).json(err));
  };

