<script setup lang="ts">
import Header from '@/components/Header.vue';
import GameInfo from '@/components/GameInfo.vue';
</script>

<template>
  <Header />
  <div class="game-info-container">
    <GameInfo />
  </div>
</template>

<style scoped>
.game-info-container {
  padding: 1rem;
  overflow-y: scroll;
}

@media only screen and (max-width: 500px) { 
  .game-info-container {
    height: 90vh;
  }
}
</style>