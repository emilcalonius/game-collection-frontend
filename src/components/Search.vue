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
          .get(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
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
      client: instantMeiliSearch(
        import.meta.env.VITE_MEILISEARCH_HOST,
        import.meta.env.VITE_MEILISEARCH_KEY
      ),
      searchTerm: "",
      games: [] as any[],
      ownedGameIds: [] as number[],
      wishlistedGameIds: [] as number[]
    }
  },
  methods: {
    async removeGame(gameId: number, status: string) {
      let token;
      if(isLoggedIn()) {
        token = getToken();

        await axios
          .delete(import.meta.env.VITE_BACKEND_HOST + "/api/game/" + gameId, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            })
            .catch(err => console.log(err));

        await axios
          .get(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
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
    async addGame(game: Game, status: string) {
      let token;
      if(isLoggedIn()) {
        token = getToken();

        if(status === "owned") {
          // If adding wishlisted game as owned or completed, remove from wishlisted list,
          // add to owned list and update game through API
          if(this.wishlistedGameIds.includes(parseInt(game.id))) {
            this.wishlistedGameIds = this.wishlistedGameIds.filter(gameId => gameId != parseInt(game.id));
            this.ownedGameIds.push(parseInt(game.id));
            let id = this.games.find(item => item.game_id == game.id).id;
            await axios
              .patch(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
                "id": id,
                "game_id": game.id,
                "user_id": getId(),
                "status": status,
                "completed": false,
                "rating": 0,
                "header_image": game.header_image,
                "name": game.name
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

        await axios
          .post(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
            "game_id": game.id,
            "user_id": getId(),
            "status": status,
            "header_image": game.header_image,
            "name": game.name
          },
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          .catch(err => console.log(err));
        }
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
          <button v-else class="remove-btn" @click="removeGame(parseInt(item.id), 'owned')">Remove</button>
          <button
            v-if="!ownedGameIds.includes(parseInt(item.id))
            && !wishlistedGameIds.includes(parseInt(item.id))"
            class="wishlist-btn"
            @click="addGame(item, 'wishlisted')"
          >
            Wishlist
          </button>
          <button 
            v-if="wishlistedGameIds.includes(parseInt(item.id))" 
            class="remove-btn"
            @click="removeGame(parseInt(item.id), 'wishlisted')"
          >
            Unwish
          </button>
          <button v-if="ownedGameIds.includes(parseInt(item.id))" class="wishlist-btn disabled">
            Wishlist
          </button>
        </div>
      </template>
    </ais-hits>
  </ais-instant-search>
</template>

<style>
.add-btn, .wishlist-btn, .remove-btn {
  padding: 7px;
  font-size: 1.2rem;
  font-weight: bold;
  width: 6.5rem
}

.remove-btn {
  background-color: hsl(0, 100%, 50%);
}

.disabled {
  background-color: lightslategray;
}

.ais-InstantSearch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ais-SearchBox-input {
  width: 20rem;
  max-width: 80vw;
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
  max-height: 50vh;
  width: max-content;
  background-color: #222222;
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
  font-size: 1.2rem;
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

  .remove-btn:hover {
    background-color: rgb(133, 0, 0);
  }
}

@media only screen and (max-width: 500px) {
  .buttons {
    display: none;
  }

  .ais-Hits-list {
    width: 20rem;
    max-width: 80vw
  }
}
</style>