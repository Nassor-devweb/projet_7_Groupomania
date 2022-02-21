const express = require('express');
const bodyParser = require("body-parser");
const useroutes = require("./routes/user");
const messagesroutes = require("./routes/messages");
const path = require("path"); 

  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//app.use((req, res) => {
  //  res.json({ message: 'Votre requête a bien été reçue!' }); 
 //});
 


app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images"))); 
app.use("/api/auth", useroutes);
//app.use("/api/messages", messagesroutes);

  module.exports = app;
  