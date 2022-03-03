<template>
    <button @click.prevent="disconect" type="submit" class="btn-disconect">Deconnexion</button>
</template>

<script>
export default {
  name: 'DisconectApp',

methods:{ 
  disconect() {
  localStorage.clear();
  document. location. href="http://localhost:8080/LoginApp";
}

}
}
</script>

<style scoped>

.btn-disconect{
  font-weight: bold;
  background-color: #d55844;
  font-size: 15px;
  text-decoration: none;
  color: white;
  border: 0px solid;
  border-radius: 20px;
  cursor:pointer;
  width: 50%;
  height: 100%;
  padding: 0px;
}

.fa-power-off{
  font-size: 30px;
}
</style>