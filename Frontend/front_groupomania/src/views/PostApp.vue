<template>
  <main class="container-page">
    <header class="header-signup">
       <div class="logo_groupomania_header">
          <router-link class="login-page" to="/PostApp">
              <img src="../assets/logo.png" alt="logo-groupomania" class="img_logo_groupomania_header">
          </router-link>
       </div>
       <div class="BoutonDisconect">
              <DisconectApp/>
              <router-link class="redirection-profil" to="/ProfilUser">
                <p class="usernameprof" >{{ member.username }}</p>
              </router-link>
              <router-link class="redirection-profil" to="/ProfilUser">
                  <p v-if="member.profilPhoto"> 
                      <img class="photoprofil" :src="member.profilPhoto" alt="..."  />
                  </p>
              </router-link>
        </div>
    </header>
    <form class="section">

  <!--partie envoie message -->
      <div class="send_msg">
          <div class="form-group">
            <label for="inputTitle">
                <span class="label_send_message">Titre</span> 
            </label><br>
            <input type="text" class="form-control" id="inputTitle" v-model="dataMessage.titre" />
          </div>
          <div class="form-group">
              <label for="inputContent">
                  <span class="label_send_message">message</span>
              </label><br>
              <input id="inputContent" v-model="dataMessage.contenu" >
          </div>
          <div class="form-group">
              <label for="inputFile">
                  <span class="cacher">aaaa</span>
              </label>
              <div class="btn-upload"> 
                  <input name="inputFile" type="file" class="upload" id="inputFile" @change="onFileChanged"/>
              </div>
          </div>
          <button @click.prevent="SendMessage" type="submit" class="btn-publier">Envoyer</button>
          <p class="msg">{{msg}}</p>
      </div>

<!--partie affichage message -->

    <div class="container2">
      <div class="titre_message_h1">
        <h1>Groupomania News</h1>
      </div>
      <div class = "container_msg_com">
          <ul id="example-1">
              <li v-for="item in posts" :key="item.id" class="one-msg"> 
                <div class="contenu_message">
                    <div class="titre_message">
                        <span>{{ item.titre }}<br></span>
                    </div>
                    <div class="photo_profil" v-if="item.User.profilPhoto">
                        <img class="photoprofil" :src="item.User.profilPhoto" alt="..."  />
                    </div>
                    <div class="contenu_msg"> 
                        <p>{{ item.contenu }}</p>
                    </div>
                    <div v-if="item.Photo"> 
                        <img :src="item.Photo" alt="..."  />
                    </div>
                    <div>
                        <p>Publié par <strong>{{ item.User.username }}</strong> le {{item.createdAt.split('T')[0]}} à {{item.createdAt.slice(11,16)}}</p>
                    </div>
                    <div v-if="member.id==item.userId || member.admin">
                        <button @click.prevent="DeleMessage(item.id, item.userId)" id="btn-sup" type="submit" class="btn btn-primary">Supprimer msg</button>
                    </div>
                </div>   
                <div class="affichage_com">
                    <div class="create_com">
                          <input type="text" id="comment" name="comment" class="form-control"  v-model="dataComment.contenu" placeholder="commentaire">
                          <p v-on:click="createComment(item.id)" id="send">Envoyer</p>
                    </div>
                      <ul class="example-2"> <!--partie affichage commentaire -->
                            <li v-for="comment in item.Comments" :key="comment.id" class="display_comment">
                              <div>
                                  <p class="username_com"><strong>{{ comment.User.username }}</strong></p> 
                                  <p class="com_contenu">{{ comment.contenu }}</p>
                                  <p class="create_date"> le {{comment.createdAt.split('T')[0]}} à {{comment.createdAt.slice(11,16)}}</p>
                              </div> 
                              <div>
                                  <p v-if="member.id==comment.userId || member.admin"> 
                                  <i class="fa-solid fa-paper-plane-top"></i>
                                  <button @click.prevent="DeleteComment(comment.id, comment.userId)" id="btn-sup" type="submit" class="btn btn-primary">supprimer</button>
                                  </p>
                              </div>
                              
                              
                          </li>
                      </ul> 
                </div>
              </li> 
          </ul> 
      </div>
    </div>
  </form>
</main>
</template>

<script>
import DisconectApp from '@/components/DisconectApp.vue';
import axios from "axios";

export default {
  name: "PostApp",
  components :{DisconectApp},
  data() {
    return {
      dataMessage: {
        titre: null,
        contenu: null,
        file: null
      },
        msg:"",
      dataComment:{
      contenu:null,
      },
      
      posts: [], 
      member: [], 
    };
  },
   
  mounted() { 
      axios.get("http://localhost:3000/api/auth/me", {headers: {Authorization: "Bearer " + localStorage.getItem("recuptoken")}})
        .then(response => {
          console.log('réponse API',response);
          this.member = response.data
        })
        .catch(error => console.log(error));

      axios.get("http://localhost:3000/api/messages",{headers: {Authorization: "Bearer " + window.localStorage.getItem("recuptoken")}})
        .then(response => {
          console.log(response);
          this.posts = response.data})
        .catch(error => console.log(error));},   

  methods: {

    SendMessage() {
      
      const formData = new FormData();
      formData.append('titre', this.dataMessage.titre); 
      formData.append('contenu', this.dataMessage.contenu);
      formData.append('inputFile', this.dataMessage.file);
      console.log(this.dataMessage.file);
    


      
      {axios.post("http://localhost:3000/api/messages", formData ,{headers: {Authorization: "Bearer " + window.localStorage.getItem("recuptoken")}})
          .then(response => {
              console.log(response);
              window.location.reload();})
          .catch((err) => {
                  console.log(err.response);
                  this.msg = err.response.data.message;});} 
          

    },

      onFileChanged (event) { 
        this.dataMessage.file = event.target.files[0];
        console.log(this.dataMessage.file)
      },

      DeleMessage (msgId, userIdMsg) { 
        if (window.confirm("Voulez vous vraiment supprimer le post?"))
        
        axios.delete("http://localhost:3000/api/messages/"+ msgId, {data:{userIdMsg}, headers: { Authorization: "Bearer " + window.localStorage.getItem("recuptoken")},})
        .then(() => {
          window.location.reload();})
        .catch(error => console.log(error));
      },


      createComment(messageId) {
        const contenu = document.getElementById('comment');
        const infocomment = { 
            contenu: contenu.value,
            messageId:messageId
          }

        if (contenu.value !==null)  
          console.log(this.dataComment)

          {axios.post("http://localhost:3000/api/messages/comments",infocomment,{ headers: {Authorization: "Bearer " + window.localStorage.getItem("recuptoken")}})
              .then(response => {
                  console.log(response);
                  window.location.reload()})
              .catch(error => console.log(error));
          }
        },


      DeleteComment (id, userIdComment) { 
      console.log(userIdComment);
        if (window.confirm("Voulez vous vraiment supprimer le commentaire?"))
        axios.delete("http://localhost:3000/api/messages/comments/"+id,{data:{userIdComment}, headers: {Authorization: "Bearer " + window.localStorage.getItem("recuptoken")},})
            .then(() => {
              
              window.location.reload();})
            .catch(error => console.log(error));
      }, 
  }
};
</script>

<style scoped>

li{
  list-style-type: none;
}

.one-msg{
  border: 2px solid black;
  box-shadow: 3px 3px 3px black ;
  margin-top: 20px;
  border-radius: 10px;
}
img {
  width: 250px;
  height: 50px;
}

template{
  position: relative;
}

main{
      font-family: "roboto";
      height: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      background-color: #18191b;
      align-content: flex-start;
      color: white;
      
  }
.send_msg{
  background-color: rgba(36, 37, 39, 1);
  font-family: Arial, Helvetica, sans-serif;
  border: 2px solid none;
  box-shadow: 3px 3px 3px black;
  width: 100% ;
  margin-top: 20px;
  border-radius: 10px;
  
}
.section {
      height: 100%;
      margin-top: 0px;
      width: 60% ;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: space-around;
      margin: auto;
  }
.form-group{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
  }

#example-1{
  padding: 0px;
}
.photoprofil{ /*photo profil de la page profil perso*/
  height: 50px;
  width: 100% ;
  border-radius: 50px;
}
.com_contenu{
  font-size: 16px;
  width: 100%;
  text-align: left;
  margin: 0px;
}
.container2 {
      width: 100%;
      background-color: rgba(36, 37, 39, 1);
      box-shadow: 5px 5px 5px rgba(28, 26, 25, 0.5);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: space-around;
      margin-top: 20px;
}
.create_date{
  font-size: 11px;
  text-align: left;
}
.example-2{
  padding: 0px 10px;
}
.titre_message_h1{
  width: 100%;
}
.username_com{
  max-width: 50px;
  background-color: #d55844;
  text-align: left;
  margin: 5px 0px;
}
.container_msg_com{
  width: 70%;
}
.container2 .photoprofil{ 
  height: 65px;
  width: 65px;
  border-radius: 50px;
  margin-top: 8px;
}
.create_com{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 1px solid grey;
  border-top: 1px solid grey;
}
.header-signup {
      box-shadow: 5px 5px 5px rgba(28, 26, 25, 0.5);
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 60px;
      background-color: #d55844;
}
.usernameprof,.redirection-profil{
  font-weight: bold;
  color: white;
  margin: 0px;
  text-decoration: none;
}
.cacher{ 
    display: none;
}

span {
  font-weight: bold;
  font-size: 15px;
}
label{
  width: 100%;
  text-align: left;
}

.contenu{ 
  font-size: 20px;
}

.test{ 
  display: flex;
  flex-direction: column;
  background-color: #FFFAFA;
  background-position: center;
  background-size: 25%;
}

.label_send_message{
  margin-left: 5px;
}
.profilsansphoto{
  color: blue;
  position: absolute;
  right: 60px;
}

.fa-arrow-circle-up{
  font-size: 30px;
}

.fas-fa-users{
  size: 40px;
}

.BoutonDisconect{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 30%;

}

.test li{ 
  background-color:#F2F2F2;
  margin-bottom: 30px;
  border: 2px solid none;
  border-radius: 8px;
  box-shadow: 1px 1px 2px #555;
  list-style: none;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
}

.send_msg img{ 
  width: 250px;
  height: 50px;
  position: absolute;
  left: 10px;
}

#comment{
  width: 60%;
}

.container2 img{ 
  width: 350px;
  height: 340px;
  border: 2px solid none;
  border-radius: 20px;
}

small{ 
  position: absolute;
  right: 10px;
  top: 26px;
}
.display_comment{
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-top: 0px;
  border-bottom: 1px solid grey;
}
.redirection-allprofil{
   position: absolute;
  right: 150px;
  top: 66px;
  font-size: 35px;
}

input, textarea{
  height: 20px;
  border: 1px solid black;
  box-shadow: 1px 1px 1px black;
  margin: 5px;
  background-color: rgba(57, 58, 60, 1);
  border-radius: 10px;
  color: white;
}
#inputTitle{
  width: 30%;
}
#inputContent{
  width: 80%;
}


.fa-trash-alt{ 
font-size: 30px;

}

.fa-comment{ 
  font-size: 80px;
  margin-left: 10px;
  cursor: pointer;
}

#btn-sup{
margin-bottom: 10px;
}

#btn-sup, .btn-publier{
    padding: 5px;
    font-size: 15px;
    font-weight: bold;
    background-color: #d55844 ;
    text-decoration: none;
    color: white;
    border: 0px solid;
    cursor:pointer;
    height: 30px;
    margin: 15px;
}
#send {
    padding: 5px;
    font-size: 15px;
    font-weight: bold;
    background-color: #d55844 ;
    text-decoration: none;
    color: white;
    border: 0px solid;
    cursor:pointer;
    height: 20px;
    margin: 5px;
}
#btn-sup:hover,.btn-publier:hover, #send:hover {
  opacity: 0.8;
  box-shadow: 5px 5px 5px black;
}

@media (max-width: 767px) {


        .send_msg img{
          width: 250px;
          height: 50px;
          position: static;
        } 

        .BoutonDisconect{
          width: 50%;
        }

        .container_msg_com{
          width: 85%;
        }

        .container2 img{
          width: 150px;
          height: 140px;
          border: 2px solid none;
          border-radius: 20px;
        }


        .profilsansphoto{
          position: static;
        }

        .redirection-allprofil{
          position: static;
          right: 150px;
          top: 66px;
          font-size: 35px;
        }

        small{
          position: static;
        }

        Footer{
          width: 92%;
        }

}

@media (max-width: 640px){
    .section{
      width: 80%;
    }
    .logo_groupomania_header{
      width: 50%;
    }
    .img_logo_groupomania_header{
      width: 100%;
    }
}

@media (max-width: 480px){
    .logo_groupomania_header{
      width: 40%;
    }
    .img_logo_groupomania_header{
      width: 100%;
    }
    .BoutonDisconect{
      width: 50%;
    }
    header .photoprofil{
      width: 80%;
    }
    .btn-disconect{
      font-size: 12px;
    }
    .section{
      width: 95%;
    }
    .com_contenu{
      font-size: 14px;
    }
}

@media (max-width: 380px){
    .logo_groupomania_header{
      width: 30%;
      display: flex;
      align-items: center;
    }
    .img_logo_groupomania_header{
      width: 100%;
      height: 100%;
    }
    .BoutonDisconect{
      width: 70%;
    }
    header .photoprofil{
      width: 80%;
    }
    .btn-disconect{
      font-size: 12px;
    }
    #inputFile{
      width: 60%;
    }
}





</style>

