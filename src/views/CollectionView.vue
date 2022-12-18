<script setup lang="ts">
import Header from '../components/Header.vue';
import Library from '../components/Library.vue';
</script>

<template>
  <Header />
  <Suspense>
    <template #default>
      <Library />
    </template>
    <template #fallback>
      <img class="loading" src="../assets/images/loading.gif" alt="loading gif">
    </template>
  </Suspense>
</template>

<style scoped>

</style>