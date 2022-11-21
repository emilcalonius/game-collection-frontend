<script setup lang="ts">
import Header from '../components/Header.vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();
</script>

<template>
  <Header />
  <div class="container">
    <img class="header-img" :src="gameStore.game['Header image']" alt="">
    <h1>{{ gameStore.game.Name }}</h1>
    <div class="devs">
      <div class="developers">
        <h2>Developers:</h2>
        <p>{{ gameStore.game.Developers.split(',').join(', ') }}</p>
      </div>
      <div class="publishers">
        <h2>Publishers:</h2>
        <p>{{ gameStore.game.Publishers.split(',').join(', ') }}</p>
      </div>
    </div>
    <div class="categories">
      <div v-if="gameStore.game.Genres !== ''" class="genres">
        <h3>Genres:</h3>
        <p>{{ gameStore.game.Genres.split(',').join(', ') }}</p>
      </div>
      <div v-if="gameStore.game.Tags !== ''" class="tags">
        <h3>Tags:</h3>
        <p>{{ gameStore.game.Tags.split(',').join(', ') }}</p>
      </div>
    </div>
    <div class="release-date">
      <h3>Release date:</h3>
      <p>{{ gameStore.game['Release date'] }}</p>
    </div>
    <h2>Description:</h2>
    <p>{{ gameStore.game["About the game"] }}</p>
    <h2>Screenshots:</h2>
    <div class="screenshots">
      <img class="screenshot" v-for="gameScreenshot in gameStore.game.Screenshots.split(',')" :src="gameScreenshot" alt="screenshot" />
    </div>
  </div>
</template>

<style scoped>
.publishers, .developers, .genres, .tags {
  display: flex;
  flex-direction: column;
  max-width: 50%;
}

.categories, .devs {
  display: flex;
  gap: 1rem;
  max-width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.screenshots {
  width: 100%;
  display: flex;
  gap: 1rem;
  overflow-x: scroll;
  padding-bottom: 1rem;
}

.screenshot {
  width: 30rem;
}

.header-img {
  width: 20rem;
}
</style>