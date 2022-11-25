<script lang="ts">
import axios from 'axios';
import { isLoggedIn, getToken } from '@/utils/jwtUtil';

export default {
  async mounted() {
    let token;
    if(isLoggedIn())
      token = getToken();
    axios
      .get("http://localhost:8080/api/game", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => console.log(res.data))
      .catch(error => console.log(error));
  }
}
</script>

<template>
  
</template>

<style scoped>

</style>