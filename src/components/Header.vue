<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { isLoggedIn } from '@/utils/jwtUtil';

function logout() {
  document.cookie = "token=;expires=" + new Date(0).toUTCString();
  document.location.reload()
}
</script>

<template>
  <div class="header-container">
    <div>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="isLoggedIn()" to="/collection">Collection</RouterLink>
      <RouterLink v-if="isLoggedIn()" to="/profile">Profile</RouterLink>
    </div>
    <div>
      <div class="logged-out-btns" v-if="!isLoggedIn()">
        <RouterLink to="/register">Sign up</RouterLink>
        <RouterLink class="login" to="/login">Log in</RouterLink>
      </div>
      <div class="logged-in-btns">
        <button v-if="isLoggedIn()" class="logout" @click="logout()">Log out</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  padding-bottom: 2rem;
  display: flex;
  justify-content: space-between;
}
.logged-out-btns {
  display: flex;
  gap: 1rem;
}

.logged-in-btns {
  display: flex;
  gap: 1rem;
}

.login {
  background-color: hsla(160, 100%, 37%, 1);
  border-radius: 10px;
  color: var(--vt-c-black);
}

@media(hover: hover) {
  .login:hover {
    background-color: hsla(160, 96%, 46%, 0.596);
  }
}
</style>