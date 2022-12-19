<script lang="ts">
import EditUserInfo from '@/components/EditUserInfo.vue';
import Header from '../components/Header.vue';
import axios from 'axios';
import {isLoggedIn, getToken} from '../utils/jwtUtil';

export default {
  async mounted() {
    let token;
    if(isLoggedIn()) {
      token = getToken();
    }
    let user;
    await axios
      .get(import.meta.env.VITE_BACKEND_HOST + "/api/user", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => user = res.data)
      .catch(error => console.log(error));
    if(typeof user === "object")  
      this.user = user;
  },
  components: {
    EditUserInfo,
    Header
},
  data() {
    return {
      user: {}
    }
  }
}
</script>

<template>
  <Header />
  <div class="edit-profile-container">
    <h1>Profile</h1>
    <EditUserInfo :user="user" />
  </div>
</template>

<style scoped>
.edit-profile-container {
  padding: 1rem;
  overflow-y: scroll;
}

@media only screen and (max-width: 500px) { 
  .edit-profile-container {
    height: 85vh;
  }
}
</style>