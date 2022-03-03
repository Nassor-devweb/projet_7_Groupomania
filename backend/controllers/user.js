const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require("../models");
const Users = models.User;
const Message = models.Message;
const Comment = models.Comment;

const passwordValidator = require("password-validator");
const schema = new passwordValidator(); //Création d'un schema avec le module password-validator pour un mots de passe sécurisé.
schema
    .is().min(8)
    .has().digits(1)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().symbols(1)
    .has().not().spaces();

exports.signup = (req, res, next) => {

    if (!schema.validate(req.body.password)) {
      //Renvoie une erreur si le mots de passe ne respecte pas le schema definis.
      return res.status(401).json({ message: "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule, un symbole et ne pas contenir d'espace !" });
    }

    if (req.body.email == null || req.body.username == null || req.body.password == null) {
      return res.status(400).json({ error: "Veuillez saisir les infos requises" });
    }

    let profilPhotoUrl;
    if (req.file) {
      console.log(req.file);
      //on vérifie si il y a une image dans la requête
      profilPhotoUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`; 
    } else {
      profilPhotoUrl == null;
    }; 
    Users.findOne({attributes: ["email"], where: { email: req.body.email }})
    .then((searchEmail) => {
      console.log(searchEmail);
       if (searchEmail){ return res.status(500).json({ message: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur !'})};
      bcrypt.hash(req.body.password, 10)
          .then(hash => {
            console.log(hash);
            const user = {
              email: req.body.email,
              username: req.body.username,
              password: hash,
              admin: 0,
              profilPhoto: profilPhotoUrl
            };
            console.log(user);
            console.log(profilPhotoUrl);
            Users.create(user)
              .then(() => res.status(201).json({message: 'utilisateur créé !'}))
              .catch(() => res.status(400).json({message: 'impossible de créer l utilisateur !'}));
          })
          .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res) => {
    Users.findOne({ where: { email: req.body.email} })
      .then((user) => {
        if (!user) return res.status(401).send({ message: "vous n'êtes pas inscrit veuillez vous inscrire" });
        bcrypt.compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({message: 'Mot de passe inccorect !'});
            }
            res.status(200).json({
              userId: user.id,
              message: "connexion réussie",
              token: jwt.sign({ userId: user.id, admin: user.admin },'RANDOM_TOKEN_SECRET', {
                expiresIn: "24h",
              }),
            });
          })
          .catch( error => res.status(500).json({error}));
      })
      .catch( error => res.status(500).json({error}));
};

exports.allProfilUser = (req, res) => {
    Users.findAll({
      include: [{model: Message, attributes: ["contenu"]}],})
      .then((data) => { res.status(200).json({data});})
      .catch((error) => { res.status(400).json({ error });});
};

exports.deleteProfile = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log("je suis perdu");
    if (userId != null) {
        Users.findOne({where: { id: userId }})
          .then((user) => {
            if (user != null) {
              console.log(user);
                  Message.findAll({where : { userId:user.id}})
                  .then ((messages) => { 
                    messages.forEach((message) => {const messageId = message.id;
                  Comment.destroy({where: { messageId: messageId }});});}),  
                  Message.destroy({where: { userId: user.id },})
                  .then(() => {
                    Users.destroy({where: { id: user.id },})
                      .then(() => res.end()) 
                      .catch((err) => res.status(500).json(err));
                  })
                  .catch((err) => res.status(500).json(err));
            } else {
                res.status(401).json({ error: "utilisateur inexistant" });
            }
          });
    } else {
        res.status(500).json({error: "Compte non supprimé"});
    }
};

exports.infoUser = (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;

  models.User.findOne({
    attributes: ["id", "email", "username", "admin", "profilPhoto"],
    where: { id: userId }, 
  })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json(error));
};




  