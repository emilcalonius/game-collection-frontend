<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { isLoggedIn } from '@/utils/jwtUtil';

function openMenu() {
  // Toggle between hamburger menu or x icons
  document.getElementById("menu-button")?.classList.toggle("change");

  // Hide or show menu
  const menu = document.getElementById("nav-btns")!;
  menu.dataset.state == "open" ? menu.dataset.state = "closed" : menu.dataset.state = "open";
}

function logout() {
  document.cookie = "token=;expires=" + new Date(0).toUTCString();
  document.location.reload()
}
</script>

<template>
  <div class="header-container">
    <div id="menu-button" @click="openMenu()">
      <div id="bar1"></div>
      <div id="bar2"></div>
      <div id="bar3"></div>
    </div>
    <div id="nav-btns" data-state="closed">
      <div class="btns">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="isLoggedIn()" to="/collection">Collection</RouterLink>
        <RouterLink v-if="isLoggedIn()" to="/profile">Profile</RouterLink>
      </div>
    </div>
    <div>
      <div class="logged-out-btns" v-if="!isLoggedIn()">
        <RouterLink to="/register">Sign up</RouterLink>
        <RouterLink class="login" to="/login">Log in</RouterLink>
      </div>
      <div class="logged-in-btns" v-if="isLoggedIn()">
        <button class="logout" @click="logout()">Log out</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#menu-button {
  display: none;
}

.header-container {
  padding: 1rem;
  padding-bottom: 0;
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
  background-color: var(--ec-green-dark);
  border-radius: 10px;
  color: var(--vt-c-black);
  border: 0;
}

@media(hover: hover) {
  .login:hover {
    background-color: hsl(109, 12%, 43%);
  }
}

@media only screen and (max-width: 500px) {
  .header-container {
    height: 10vh;
  }

  .btns {
    display: flex;
    flex-direction: column;
    padding-left: 2rem;
  }

  #nav-btns {
    position: absolute;
    top: 0;
    background-color: var(--color-background);
    z-index: 2;
    transition: height 0.3s, border-radius 0.3s, width 0.3s;
    overflow: hidden;
    transform: translate(-2rem, -2rem);
    align-items: center;
    padding-top: 7rem;
  }

  #bar1,
  #bar2,
  #bar3 {
    width: 35px;
    height: 5px;
    background-color: var(--ec-green-dark);
    margin: 6px 0;
    transition: 0.4s;
  }

  .change #bar1 {
    -webkit-transform: rotate(-45deg) translate(-9px, 6px);
    transform: rotate(-45deg) translate(-9px, 6px);
  }

  .change #bar2 {
    opacity: 0;
  }

  .change #bar3 {
    -webkit-transform: rotate(45deg) translate(-8px, -8px);
    transform: rotate(45deg) translate(-8px, -8px);
  }

  #menu-button {
    padding: 10px;
    cursor: pointer;
    border-radius: 15px;
    display: block;
    z-index: 3;
  }

  #nav-btns[data-state="closed"] {
    height: 0vh;
    border-radius: 0px 100% 100% 100%;
    width: 0vw;
  }

  #nav-btns[data-state="open"] {
    margin-top: 2rem;
    height: 100vh;
    border-radius: 0%;
    width: 102vw;
  }
}
</style>