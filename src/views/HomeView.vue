<script setup lang="ts">
import Welcome from '../components/Welcome.vue';
import Search from '../components/Search.vue';
import { RouterLink } from 'vue-router';
import { isLoggedIn } from '@/utils/jwtUtil';

function logout() {
  document.cookie = "token=;expires=" + new Date(0).toUTCString();
  document.location.reload()
}
</script>

<template>
  <main>
    <div class="login-register-btns" v-if="!isLoggedIn()">
      <RouterLink to="/register">Sign up</RouterLink>
      <RouterLink class="login" to="/login">Log in</RouterLink>
    </div>
    <button v-if="isLoggedIn()" class="logout" @click="logout()">Log out</button>
    <Welcome />
    <Search />
    <RouterLink to="/profile">Profile</RouterLink>
  </main>
</template>

<style scoped>
.login-register-btns {
  display: flex;
  gap: 1rem;
}

.login, .logout {
  background-color: hsla(160, 100%, 37%, 1);
  border-radius: 10px;
  color: var(--vt-c-black);;
}

a {
  padding: 5px;
}

@media(hover: hover) {
  .login:hover {
    background-color: hsla(160, 96%, 46%, 0.596);
  }
}
</style>