<script lang="ts">
import {getName, getToken, isLoggedIn} from '../utils/jwtUtil';

export default {
  methods: {
    isLoggedIn(): Boolean {
      return isLoggedIn();
    },
    getName(): String | null {
      const token = getToken();
      if(typeof token === "string") {
        return getName(token);
      } 
      return null;
    }
  }
}
</script>

<template>
  <p v-if="isLoggedIn()">Hello, {{getName()}}! 🎮</p>
  <p v-if="!isLoggedIn()">Log in to build your collection!</p>
</template>

<style scoped>
p {
  font-size: 2rem;
}
</style>