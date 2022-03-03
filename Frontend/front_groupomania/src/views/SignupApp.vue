<template>
  <div class="container-page">
    <header class="header-signup">
       <div class="logo_groupomania_header">
          <router-link class="login-page" to="/PostApp">
              <img src="../assets/logo.png" alt="logo-groupomania" class="img_logo_groupomania_header">
          </router-link>
       </div>
       <div class="header-connexion">
           <router-link class="login-page-signup" to="/LoginApp">Connexion</router-link>
       </div>
    </header>
    <form class="section">
       <div class="titre-page">
          <h3 class="welcome">Bienvenue sur Groupomania, inscrivez-vous</h3>
       </div>
       <div class="formulaire">
          <div class="form-group">
              <label for="inputEmail"><span>Email:</span></label>
              <input type="email" class="form-control" id="inputEmail" v-model="dataUser.email" />
          </div>
          <div class="form-group">
              <label for="inputUsername"><span>Pseudo:</span></label>
              <input type="text" class="form-control" id="inputUsername" v-model="dataUser.username" />
          </div>
          <div class="form-group">
              <label for="inputPassword"><span>Mot de passe:</span></label>
              <input type="password" class="form-control" id="inputPassword" v-model="dataUser.password"/>
          </div>
          <div class="btn-upload"> 
              <input accept="image/jpeg, image/jpg" name="inputFile" type="file" class="upload" id="inputFile" @change="onFileChanged"/>
          </div>
          <button @click.prevent="userSignup" type="submit" class="btn-signup">Inscription</button>
          <p id="msg">{{ msg }}</p>
       </div>
    </form>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "SignupApp",
  data() {
    return {
      dataUser: { 
        username: null,
        email: null,
        password: null,
        file:null
      },
      msg:""
    };
  },

  methods: {
    userSignup() {

      const formData = new FormData();
      formData.append('username', this.dataUser.username);
      formData.append('email', this.dataUser.email);
      formData.append('password', this.dataUser.password);
      formData.append('inputFile', this.dataUser.file);
    /*  const infoUser = { 
        username: document.getElementById('inputUsername').value,
        email: document.getElementById('inputEmail').value,
        password: document.getElementById('inputPassword').value,
        profilPhoto: document.getElementById('inputFile').file
      }
      console.log(infoUser);*/
 
    {axios.post("http://localhost:3000/api/auth/signup",formData)
        .then(response => {
            console.log(response); 
            document.location.href="http://localhost:8080/LoginApp";})
        .catch((err) => {
                  console.log(err.response.data.message);
                  
                  this.msg = err.response.data.message;   
                
        });} 
    },
    onFileChanged (event) { 
      this.dataUser.file = event.target.files[0];
      console.log(this.dataUser.file)
    }
  }
};
</script>

<style scoped>

img {
  width: 250px;
  height: 50px;
}
.container-page{
  box-sizing: border-box;
  font-family: "roboto";
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: #efefef;
  background-image: url("../assets/groupomaniaS.JPG");
}
.header-signup {
  box-shadow: 5px 5px 5px rgba(28, 26, 25, 0.5);
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background-color: #d55844;
}
.logo_groupomania_header{
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img_logo_groupomania_header{
  width: 100%;
  max-width: 250px;
}

.header-connexion{
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-page-signup {
  text-decoration: none;
  color: white;
  margin: 0px;
  font-size: 20px;
  font-weight: bold;
}
.section {
  margin-top: 0px;
  width: 70% ;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.titre-page {
  width: 100% ;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.formulaire {
  width: 40%;
  background-color: white;
  box-shadow: 5px 5px 5px rgba(28, 26, 25, 0.5);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: space-around;
  margin-bottom: 50px;
}

.form-group,.btn-upload{
  margin-bottom: 20px;
  margin-left: 20px;
}
.welcome{
  color: white;
  font-size: 30px;
  font-weight: bold;
}

span { 
  font-weight: bold;
}

.btn-signup{
  padding: 5px;
  font-size: 15px;
  font-weight: bold;
  background-color: #d55844 ;
  text-decoration: none;
  color: white;
  border-radius: 10px;
  cursor:pointer;
  width: 50% ;
  max-width: 160px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

.btn-signup:hover {
  opacity: 0.8;
  box-shadow: 5px 5px 5px black;
}

#inputEmail, #inputPassword, #inputUsername{
  height: 20px;
  border: 1px solid black;
  box-shadow: 1px 1px 1px black;
  margin: 5px;
}

.msg{
  color: red;
}

  @media (max-width: 767px) {
    .formulaire{
      width: 60%;
    }
    .form-control{
      width: 80%;
    }
  }
  @media (max-width: 480px) {
    .welcome{
      font-size: 18px;
    }
    .formulaire{
      width: 80%;
    }
    .form-control{
      width: 80%;
    }
    .logo_groupomania_header{
      width: 40%;
    }
    .header-connexion{
      width: 60%;
    }
  }
  @media (max-width: 380px){
    .formulaire{
      width: 95%;
    }
}

@media (max-width: 640px){
    #inputFile{
      width: 80%;
    }
}

</style>
