<script lang="ts">
import router from "@/router";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { isLoggedIn, getId, getToken } from "@/utils/jwtUtil";
import axios from "axios";

import type { Game } from '../models/game';

export default {
  async mounted() {
    let token;
      if(isLoggedIn()) {
        token = getToken();
        await axios
          .get("http://localhost:8080/api/game", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => this.games = res.data)
          .catch(error => console.log(error));
        let ownedGameIds = [] as number[];
        let wishlistedGameIds = [] as number[];
        this.games.forEach(game => {
          if(["owned", "completed"].includes(game.status)) ownedGameIds.push(game.game_id);
          if(game.status === "wishlisted") wishlistedGameIds.push(game.game_id);
        });
        this.ownedGameIds = ownedGameIds;
        this.wishlistedGameIds = wishlistedGameIds;
      }
  },
  data() {
    return {
      client: instantMeiliSearch("http://localhost:7700"),
      searchTerm: "",
      games: [] as any[],
      ownedGameIds: [] as number[],
      wishlistedGameIds: [] as number[]
    }
  },
  methods: {
    async addGame(game: Game, status: string) {
      let token;
      if(isLoggedIn())
        token = getToken();

        await axios
          .get("http://localhost:8080/api/game", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => this.games = res.data)
          .catch(error => console.log(error));

      if(["owned", "completed"].includes(status)) {
        // If adding wishlisted game as owned or completed, remove from wishlisted list,
        // add to owned list and update game through API
        if(this.wishlistedGameIds.includes(parseInt(game.id))) {
          this.wishlistedGameIds = this.wishlistedGameIds.filter(gameId => gameId != parseInt(game.id));
          this.ownedGameIds.push(parseInt(game.id));
          let id = this.games.find(item => item.game_id == game.id).id;
          axios
            .patch("http://localhost:8080/api/game", {
              "id": id,
              "game_id": game.id,
              "user_id": getId(),
              "status": status,
              "completed": false,
              "rating": 0
            },
            {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            })
            .catch(err => console.log(err));
          return;
        }
        this.ownedGameIds.push(parseInt(game.id));
      } 
      if(status === "wishlisted") this.wishlistedGameIds.push(parseInt(game.id));

      axios
        .post("http://localhost:8080/api/game", {
          "game_id": game.id,
          "user_id": getId(),
          "status": status
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .catch(err => console.log(err));
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
      placeholder="Search for games..."
    />
    <ais-hits v-if="searchTerm !== ''">
      <template v-slot:item="{ item }">
        <div class="game-info" @click="showGame(item)">
          <img :src="item.header_image" alt="game-header-image" />
          <h2 class="game-name">{{ item.name }}</h2>
        </div>
        <div class="buttons" v-if="isLoggedIn()">
          <button 
            v-if="!ownedGameIds.includes(parseInt(item.id))" 
            class="add-btn" 
            @click="addGame(item, 'owned')"
          >
            Add
          </button>
          <button v-else class="add-btn disabled">Add</button>
          <button
            v-if="!wishlistedGameIds.includes(parseInt(item.id)) 
              && !ownedGameIds.includes(parseInt(item.id))"
            class="wishlist-btn"
            @click="addGame(item, 'wishlisted')"
          >
            Wishlist
          </button>
          <button v-else class="wishlist-btn disabled">Wishlist</button>
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

.disabled {
  background-color: lightslategray;
}

.ais-InstantSearch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 25rem;
  max-width: 30rem;
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

  .disabled:hover {
    cursor: default;
    background-color: lightslategray;
  }
}
</style>