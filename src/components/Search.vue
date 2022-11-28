<script lang="ts">
import router from "@/router";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useGameStore } from "@/stores/game";
import { isLoggedIn, getId, getToken } from "@/utils/jwtUtil";
import axios from "axios";

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
    addGame(game: Game, status: string) {
      let token;
      if(isLoggedIn())
        token = getToken();
      axios
        .post("http://localhost:8080/api/game", {
          "game_id": game.id,
          "user_id": getId(),
          "status": status,
          "image": game.header_image
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .catch(err => console.log(err))
    },
    showGame(game: Game) {
      router.push(`/game/${game.id}`);
    },
    isLoggedIn() {
      return isLoggedIn();
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
          <img :src="item.header_image" alt="game-header-image" />
          <h2 class="game-name">{{ item.name }}</h2>
        </div>
        <div class="buttons">
          <button class="add-btn" v-if="isLoggedIn()" @click="addGame(item, 'owned')">Add</button>
          <button class="wishlist-btn" v-if="isLoggedIn()" @click="addGame(item, 'wishlisted')">Wishlist</button>
        </div>
        </template>
    </ais-hits>
  </ais-instant-search>
</template>

<style>
.add-btn, .wishlist-btn {
  padding: 7px;
  font-size: 1.2rem;
}

.ais-InstantSearch {
  max-height: 300px;
  max-width: 500px;
}

.ais-SearchBox-input {
  width: 20rem;
  height: 3rem;
  font-size: 1.5rem;
  border-radius: 10px;
}

.ais-Hits {
  padding-top: 1rem;
}

.ais-Hits-list {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 20rem;
  width: max-content;
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

.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

@media (hover: hover) {
  .game-info:hover {
    background-color: #363636;
  }
}
</style>