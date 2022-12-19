<script setup lang="ts">
import Welcome from '../components/Welcome.vue';
import Search from '../components/Search.vue';
import Header from '../components/Header.vue';
</script>

<template>
  <Header />
  <div class="home-container">
    <Welcome />
    <Search />
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  overflow-y: scroll;
}

@media only screen and (max-width: 500px) { 
  .home-container {
    height: 85vh;
  }
}
</style>