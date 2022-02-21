const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require("../models");
const Users = models.User;

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
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule, un symbole et ne pas contenir d'espace !" });
    }
  
    let profilPhotoUrl;
    if (req.file) {
      //on vérifie si il y a une image dans la requête
      profilPhotoUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    } else {
      profilPhotoUrl == null;
    }; 

    Users.findOne({attributes: ["email"], where: { email: req.body.email }})
    .then((searchEmail) => {
       if (searchEmail){ return res.status(500).json({ message: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur !'})};
      bcrypt.hash(req.body.password, 10)
          .then(hash => {
              const newUser = new Users({
                email: req.body.email,
                username: req.body.username,
                password: hash,
                admin: req.body.admin,
                profilPhoto: profilPhotoUrl
              });

            Users.create(newUser)
              .then(() => res.status(201).json({message: 'utilisateur créé !'}))
              .catch(() => res.status(400).json({message: 'impissible de créer l utilisateur !'}));
          })
          .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res) => {
    Users.findOne({ where: { email: req.body.email} })
      .then((user) => {
        if (!user) return res.status(401).send({ message: "vous n'êtes pas inscrit veuillez vous inscrir" });
        bcrypt.compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({error: 'Mot de passe inccorect !'});
            }
            res.status(200).json({
              userId: user.id,
              token: jwt.sign({ userId: user.id },'RANDOM_TOKEN_SECRET', {
                expiresIn: "24h",
              }),
            });
          })
          .catch((err) =>
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the user.",
            })
          );
      })
      .catch((err) =>
        res.status(500).send({
          message: err.message || "Some error occurred while creating the user.",
        })
      );
};

exports.allProfilUser = (req, res) => {
    Users.findAll({
      include: [
        {
          model: models.Message,
          attributes: ["id"]
        },
      ],
    })
      .then((data) => {
        res.status(200).json({data});
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
};

exports.suppressionProfile = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (userId != null) {
        Users.findOne({where: { id: userId }})
          .then((user) => {
          if (user != null) {
                models.Message.findAll({where : { userId:user.id}})
                .then ((messages) => {
                messages.forEach((message) => {const messageId = message.id;
                models.Comment.destroy({where: { messageId:messageId }});
                });
                    }),  
                models.Message.destroy({ 
                  where: { userId: user.id },
                })
                .then(() => {
                  models.User.destroy({
                    where: { id: user.id },
                  })
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
  




  