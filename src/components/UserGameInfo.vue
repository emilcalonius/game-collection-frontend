<script lang="ts">
import { getToken, isLoggedIn, getId } from '@/utils/jwtUtil';
import axios from 'axios';

export default {
  props: ['game'],
  data() {
    return {
      currentGame: {} as any,
      completed: false
    }
  },
  async mounted() {
    let token: any;
    if(isLoggedIn()) {
      token = getToken();
      let games = [] as any[];
      await axios
        .get("http://localhost:8080/api/game", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(res => games = res.data)
        .catch(err => console.log(err));
      if(games.length !== 0) {
        console.log("hello")
        const currentGame = games.find(item => item.game_id == this.game.id);
        this.currentGame = currentGame;
        this.completed = currentGame.completed;
        setTimeout(function() {
          document.querySelectorAll(".star").forEach((star, index) => {
            console.log(index)
            if(index < currentGame.rating) {
              console.log("hello ag")
              star.classList.add("active");
            }
          })
        }, 1);
      }
    }
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    rateGame(rating: number) {
      document.querySelectorAll(".star").forEach((star, index) => {
        if(index < rating) {
          star.classList.add("active");
        }
        if(index >= rating) {
          star.classList.remove("active");
        }
      });
      axios
        .patch("http://localhost:8080/api/game", {
          "id": this.currentGame.id,
          "rating": rating,
          "user_id": getId(),
          "status": this.currentGame.status,
          "completed": this.currentGame.completed,
          "game_id": this.currentGame.game_id
        },
        {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    handleCompletedClick() {
      this.completed = !this.completed;
      axios
        .patch("http://localhost:8080/api/game", {
          "id": this.currentGame.id,
          "rating": this.currentGame.rating,
          "user_id": getId(),
          "status": this.currentGame.status,
          "completed": this.completed,
          "game_id": this.currentGame.game_id
        },
        {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  }
}
</script>

<template>
  <div v-if="isLoggedIn() && Object.keys(currentGame).length > 0 && currentGame.status === 'owned'" class="user-info">
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
</template>

<style scoped>
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
  gap: 1rem;
}

.completed {
  display: flex;
  gap:1rem;
}

.checkbox {
  width: 2rem;
  cursor: pointer;
}
</style>