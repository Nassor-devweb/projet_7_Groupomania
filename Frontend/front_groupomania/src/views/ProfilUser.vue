<template>
<main>
<header class="header-signup">
          <div class="logo_header">
              <img src="../assets/logo.png" alt="logo-groupomania">
          </div>
          <div class="BoutonDisconect">
              <router-link class="login-page-signup" to="/PostApp">Accueil</router-link>
              <DisconectApp/>
          </div>
</header>
<div class="container1">
     <span> Pseudo :</span> {{ posts.username }}<br>
     <span> Email :</span> {{ posts.email }}<br>
     <span> Numéro d'identifiant :</span> {{ posts.id }} <br>
     <div v-if="posts.profilPhoto" class="img_profil"><img class="photoprofil" :src="posts.profilPhoto" alt="..."  /></div>
     <p v-if="posts.admin==true" ><span> Profil administrateur :</span> {{ posts.admin }} <br></p>
      <div><button @click.prevent="SupProfile" type="submit" class="btn-supcompte">Supprimer le compte</button></div>
</div>
</main>
</template>

<script>
import DisconectApp from '@/components/DisconectApp.vue'; 
import axios from "axios";

export default {
    name: "ProfilUser",
    components :{DisconectApp},
    data() {
        return{
        posts: [] 
      }
    },

    mounted() {
      axios.get("http://localhost:3000/api/auth/me", {headers: {Authorization: "Bearer " + localStorage.getItem("recuptoken")}})
          .then(response => {
            console.log('réponse API',response);
            this.posts = response.data
            console.log(this.posts)
            console.log(this.posts.profilPhoto);})
          .catch(error => console.log(error));
        },

    methods:{
    SupProfile() {
      if (window.confirm("Voulez vous vraiment supprimer votre compte?"))
      axios.delete("http://localhost:3000/api/auth/delete", {headers: { Authorization: "Bearer " + localStorage.getItem("recuptoken")}})
        .then(() => {
          localStorage.clear();
          document.location.href="http://localhost:8080/LoginApp";
        })
    }
}   
};
</script>

<style scoped>

.container1 {

  background-color: rgba(36, 37, 39, 1);
  font-family: Arial, Helvetica, sans-serif;
  width: 60% ;
  border: 2px solid black;
  box-shadow: 3px 3px 3px black ;
  margin-top: 20px;
  border-radius: 10px;
  color: white;
  
}
.header-signup {
      box-shadow: 5px 5px 5px rgba(28, 26, 25, 0.5);
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 60px;
      background-color: #d55844;
}
.login-page-signup{
  text-decoration: none;
  color: white;
  font-weight: bold;
}
.BoutonDisconect{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 30%;

}
img{
  width: 240px;
  height: 50px;
}

.photoprofil{
  height: 200px;
  width: 200px;
}

main{
  font-family: "roboto";
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      background-color: #18191b;
      align-content: flex-start;
      color: black;
}

span{
  font-weight: bold;
}

.btn-supcompte{
  padding: 5px;
    font-size: 15px;
    font-weight: bold;
    background-color: #d55844 ;
    text-decoration: none;
    color: white;
    border: 0px solid;
    border-radius: 10px;
    cursor:pointer;
    width: 50% ;
}

.btn-supcompte:hover {
  opacity: 0.8;
  box-shadow: 5px 5px 5px black;
}


@media (max-width: 480px) {
    .logo_header{
      width: 40%;
    }
    .logo_header img{
      width: 100%;
    }
    .BoutonDisconect{
      width: 50%;
    }
    .container1{
      width: 80%;
    }
    .img_profil img{
      width: 30% ;
      height: 100px;
    }
    .btn-supcompte{
      width: 80%;
    }
  }

  @media (max-width: 380px) {
    .BoutonDisconect{
      width: 70%;
    }
    .logo_header{
      width: 30%;
    }
  }

</style>
