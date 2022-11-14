<script lang="ts">
import UserInfo from '@/components/UserInfo.vue';
import axios from 'axios';
import {isLoggedIn, getToken} from '../utils/jwtUtil';

export default {
  async mounted() {
    if(isLoggedIn()) {
      const token = getToken();
      if(typeof token === "string") {
        this.token = token;
      }
    }
    let user;
    await axios
      .get("http://localhost:8080/api/user", {
        headers: {
          "Authorization": `Bearer ${this.token}`
        }
      })
      .then(res => user = res.data)
      .catch(error => console.log(error));
    if(typeof user === "object")  
      this.user = user;
  },
  components: {
    UserInfo
  },
  data() {
    return {
      token: "",
      user: {}
    }
  }
}
</script>

<template>
  <h1>Profile</h1>
  <UserInfo :user="user" />
</template>