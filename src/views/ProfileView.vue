<script lang="ts">
import EditUserInfo from '@/components/EditUserInfo.vue';
import UserInfo from '@/components/UserInfo.vue';
import Header from '../components/Header.vue';
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
    UserInfo,
    EditUserInfo,
    Header
},
  data() {
    return {
      token: "",
      user: {},
      showEdit: false
    }
  }
}
</script>

<template>
  <Header />
  <h1>Profile</h1>
  <UserInfo v-if="!showEdit" :user="user" @click-show-edit="(value) => showEdit = value" />
  <EditUserInfo v-if="showEdit" :user="user"  @click-show-edit="(value) => showEdit = value" />
</template>