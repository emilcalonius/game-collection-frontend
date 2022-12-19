<script lang="ts">
import { getToken, isLoggedIn, getId } from '@/utils/jwtUtil';
import axios from 'axios';

import type { Game } from '../models/game';

export default {
  props: ['game'],
  data() {
    return {
      currentGame: {} as any,
      completed: false,
      rating: 0,
    }
  },
  async mounted() {
    let token: any;
    if(isLoggedIn()) {
      token = getToken();
      let games = [] as any[];
      await axios
        .get(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(res => games = res.data)
        .catch(err => console.log(err));
      if(games.length !== 0) {
        const currentGame = games.find(item => item.game_id == this.game.id);
        if(currentGame !== undefined && currentGame !== null) {
          this.currentGame = currentGame;
          this.completed = currentGame.completed;
          this.rating = currentGame.rating;
          setTimeout(function() {
            document.querySelectorAll(".star").forEach((star, index) => {
              if(index < currentGame.rating) {
                star.classList.add("active");
              }
            })
          }, 1);
        }
      }
    }
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    async addGame(game: Game, status: string) {
      let token;
      if(isLoggedIn()) {
        token = getToken();

        // If game is wishlisted and game is to be added as owned, update game's status, else add game as new
        if(Object.keys(this.currentGame).length > 0 && this.currentGame.status === "wishlisted") {
          await axios
              .patch(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
                "id": this.currentGame.id,
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
        } else {
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

        let games = [] as any[];
        await axios
          .get(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => games = res.data)
          .catch(err => console.log(err));
        if(games.length !== 0) {
          const currentGame = games.find(item => item.game_id == this.game.id);
          if(currentGame !== undefined && currentGame !== null) {
            this.currentGame = currentGame;
            this.completed = currentGame.completed;
            this.rating = currentGame.rating;
            setTimeout(function() {
              document.querySelectorAll(".star").forEach((star, index) => {
                if(index < currentGame.rating) {
                  star.classList.add("active");
                }
              })
            }, 1);
          }
        }
      }
    },
    async removeGame(gameId: number) {
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

        this.currentGame = {};
      }
    },
    async rateGame(rating: number) {
      this.rating = rating;
      document.querySelectorAll(".star").forEach((star, index) => {
        if(index < rating) {
          star.classList.add("active");
        }
        if(index >= rating) {
          star.classList.remove("active");
        }
      });
      await axios
        .patch(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
          "id": this.currentGame.id,
          "rating": rating,
          "user_id": getId(),
          "status": this.currentGame.status,
          "completed": this.completed,
          "game_id": this.currentGame.game_id,
          "header_image": this.currentGame.header_image,
          "name": this.currentGame.name
        },
        {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        })
        .catch(err => console.log(err));
    },
    async handleCompletedClick() {
      this.completed = !this.completed;
      await axios
        .patch(import.meta.env.VITE_BACKEND_HOST + "/api/game", {
          "id": this.currentGame.id,
          "rating": this.rating,
          "user_id": getId(),
          "status": this.currentGame.status,
          "completed": this.completed,
          "game_id": this.currentGame.game_id,
          "header_image": this.currentGame.header_image,
          "name": this.currentGame.name
        },
        {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        })
        .catch(err => console.log(err));
    }
  }
}
</script>

<template>
  <template v-if="isLoggedIn()">
    <div v-if="Object.keys(currentGame).length > 0 && currentGame.status === 'owned'" class="user-info">
      <div class="rating">
        <h3>Rating:</h3>
        <div class="stars">
          <img class="star" @click="rateGame(1)" src="../assets/images/star_filled.svg" alt="filled star"/>
          <img class="star" @click="rateGame(2)" src="../assets/images/star_filled.svg" alt="filled star"/>
          <img class="star" @click="rateGame(3)" src="../assets/images/star_filled.svg" alt="filled star"/>
          <img class="star" @click="rateGame(4)" src="../assets/images/star_filled.svg" alt="filled star"/>
          <img class="star" @click="rateGame(5)" src="../assets/images/star_filled.svg" alt="filled star"/>
        </div>
      </div>
      <div class="completed">
        <h3>Completed:</h3>
        <img @click="handleCompletedClick()" v-if="!completed" class="checkbox" src="../assets/images/checkbox_empty.svg" alt="checkbox" />
        <img @click="handleCompletedClick()" v-if="completed" class="checkbox" src="../assets/images/checkbox_checked.svg" alt="checkbox" />
      </div>
    </div>
    <div v-if="isLoggedIn() && Object.keys(currentGame).length > 0 && currentGame.status === 'wishlisted'" class="wishlisted">
      <h2>🌠 On your wishlist</h2>
    </div>
    <button 
      v-if="Object.keys(currentGame).length === 0 || currentGame.status === 'wishlisted'" 
      class="add-button" 
      @click="addGame(game, 'owned')"
    >
      ✅ add to collection
    </button>
    <button 
      v-if="Object.keys(currentGame).length > 0 && currentGame.status === 'owned'" 
      class="remove-button" 
      @click="removeGame(parseInt(currentGame.game_id))"
    >
      🗑️ remove from collection
    </button>
    <button 
      v-if="Object.keys(currentGame).length === 0" 
      class="add-button" 
      @click="addGame(game, 'wishlisted')"
    >
      🌠 add to wishlist
    </button>
    <button 
      v-if="Object.keys(currentGame).length > 0 && currentGame.status === 'wishlisted'" 
      class="remove-button" 
      @click="removeGame(parseInt(currentGame.game_id))"
    >
      🚫 remove from wishlist
    </button>
  </template>
</template>

<style scoped>
.add-button {
  width: max-content;
}

.remove-button {
  background-color: hsl(0, 100%, 50%);
  font-size: 1.3rem;
  font-weight: bold;
  width: max-content;
}

.wishlisted {
  background-color: #363636;
  padding: 0.5rem;
  padding-right: 1rem;
  border-radius: 20px;
  width: max-content;
}

.stars {
  display: flex;
}

.stars:hover {
  cursor: pointer;
}

.stars:hover img {
  opacity: 100%;
}

.stars img {
  opacity: 20%;
}

.stars img:hover ~ img {
  opacity: 20%;
}

.star {
  width: 2rem;
}

.star.active {
  opacity: 100%;
}

.user-info {
  background-color: #363636;
  padding: 2rem;
  border-radius: 20px;
  width: max-content;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.completed {
  display: flex;
  gap:1rem;
}

.checkbox {
  width: 2rem;
  cursor: pointer;
}

@media (hover: hover) {
  .remove-button:hover {
    background-color: rgb(133, 0, 0);
  }
}
</style>