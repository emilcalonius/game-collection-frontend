<script setup lang="ts">
import Header from '../components/Header.vue';
import Library from '../components/Library.vue';
</script>

<template>
  <Header />
  <Suspense>
    <template #default>
      <div class="collection-container">
        <Library />
      </div>
    </template>
    <template #fallback>
      <div class="collection-container">
        <img class="loading" src="../assets/images/loading.gif" alt="loading gif">
      </div>
    </template>
  </Suspense>
</template>

<style scoped>
.collection-container {
  padding: 1rem;
  overflow-y: scroll;
}

@media only screen and (max-width: 500px) { 
  .collection-container {
    height: 85vh;
  }
}
</style>