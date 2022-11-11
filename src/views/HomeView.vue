<script setup lang="ts">
import Welcome from '@/components/Welcome.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <main>
    <div class="login">
    <RouterLink to="/login">Log in</RouterLink>
    <RouterLink to="/register">Register new account</RouterLink>
    <Welcome />
    </div>
  </main>
</template>

<style scoped>
.login {
  display: flex;
  gap: 1rem;
}
</style>