<script lang="ts">
import router from "@/router";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useGameStore } from "@/stores/game";

import type { Game } from '../models/game';

export default {
  data() {
    return {
      client: instantMeiliSearch("http://localhost:7700"),
      searchTerm: "",
      gameStore: useGameStore()
    }
  },
  methods: {
    addGame(game: Game) {

    },
    showGame(game: Game) {
      router.push(`/game/${game.Name}`);
      this.gameStore.game = game;
    }
  }
}
</script>

<template>
  <ais-instant-search
    :search-client="client"
    index-name="games"
  >
    <ais-search-box 
      v-model="searchTerm" 
    />
    <ais-hits v-if="searchTerm !== ''">
      <template v-slot:item="{ item }">
        <div class="game-info" @click="showGame(item)">
          <img :src="item['Header image']" alt="game-header-image" />
          <h2 class="game-name">{{ item.Name }}</h2>
        </div>
        <button @click="addGame(item)">+</button>
      </template>
    </ais-hits>
  </ais-instant-search>
</template>

<style>
.ais-InstantSearch {
  max-height: 300px;
  max-width: 500px;
}

.ais-Hits {
  padding-top: 1rem;
}

.ais-Hits-list {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 300px;
  width: 500px;
  background-color: #303030;
  padding: 1rem;
  border-radius: 10px;
}

.ais-Hits-item {
  display: flex;
  gap: 1rem;
}

img {
  width: 7rem;
}

.game-name {
  font-size: 1rem;
  display: table-cell;
  vertical-align: middle;
}

.ais-SearchBox-submit {
  display: none;
}

.ais-SearchBox-resetIcon {
  display: none;
}

.game-info {
  display: flex;
  flex-direction: row;
  width: 400px;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border-radius: 10px;
  padding: 0.5rem;
}

@media (hover: hover) {
  .game-info:hover {
    background-color: #363636;
  }
}
</style>