<script lang="ts">
import UserInfo from '@/components/UserInfo.vue';
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
    UserInfo,
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
  <div class="profile-container">
    <h1>Profile</h1>
    <UserInfo :user="user" />
  </div>
</template>

<style scoped>
.profile-container {
  overflow-y: scroll;
  padding: 1rem;
}

@media only screen and (max-width: 500px) { 
  .profile-container {
    height: 90vh;
  }
}
</style>