<script setup lang="ts">
import Welcome from '../components/Welcome.vue';
import Search from '../components/Search.vue';
import Header from '../components/Header.vue';
</script>

<template>
  <Header />
  <main class="main">
    <Welcome />
    <Search />
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  justify-content: center;
}
</style>