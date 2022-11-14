<script setup lang="ts">
import Welcome from '../components/Welcome.vue';
import Search from '../components/Search.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <main>
    <div class="login-register-btns">
      <RouterLink to="/register">Sign up</RouterLink>
      <RouterLink class="login" to="/login">Log in</RouterLink>
    </div>
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

.login {
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