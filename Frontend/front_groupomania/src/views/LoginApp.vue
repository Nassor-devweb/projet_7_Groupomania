<template>
  <div class="container-page">
    <header class="header-signup">
        <div class="logo_groupomania_header">
              <router-link class="login-page-signup" to="/LoginApp">
                  <img src="../assets/logo.png" alt="logo-groupomania" class="img_logo_groupomania_header">
              </router-link>
        </div>
        <div class="header-connexion">
              <router-link class="login-page-signup" to="/">Inscription</router-link>
        </div>
    </header>
    <form class="section">
        <div class="titre-page">
              <h3 class="welcome">Bienvenue sur Groupomania, veuillez vous connecter</h3>
        </div>
        <div class="formulaire">
            <div class="form-group first-input">
              <label for="inputEmail"><span>Email : </span></label>
              <input type="text" class="form-control" id="inputEmail" />
            </div>
            <div class="form-group">
              <label for="inputPassword"><span>Mot de passe : </span></label>
              <input type="password" class="form-control" id="inputPassword"/>
            </div>
            <button @click.prevent="loginUser" type="submit" class="btn-connexion">Connexion</button>
            <p class="msg">{{ msg }}</p>
        </div>
    </form>

   <FooterApp/>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginApp",
  data() {
    return {
      msg:""
    };
  },
  methods: {
    loginUser() {
            const email = document.getElementById('inputEmail');
            const password = document.getElementById('inputPassword');

            const infoUser = { 
                email: email.value,
                password: password.value
              }
            {axios.post("http://localhost:3000/api/auth/login", infoUser)
            .then(response => {
                console.log(response);
                localStorage.setItem('recuptoken',response.data.token)
                document. location. href="http://localhost:8080/PostApp";})
            .catch((err) => {
                  console.log(err.response);
                  this.msg = err.response.data.message;});} 
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

    .login-page-signup {
      text-decoration: none;
      color: white;
      margin: 0px;
      font-size: 20px;
      font-weight: bold;
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

    .welcome{
      color: white;
      font-size: 30px;
      font-weight: bold;
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
    .first-input{
      margin-top: 40px;
    }

    .form-group{
      margin-bottom: 20px;
      margin-left: 20px;
    }

    span { 
      font-weight: bold;
    }

    .btn-connexion{
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

    .btn-connexion:hover {
      opacity: 0.8;
      box-shadow: 5px 5px 5px black;
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
</style>