<script lang="ts">
import axios from 'axios';
import { isLoggedIn, getToken } from '@/utils/jwtUtil';
import type { Game } from '@/models/game';
import MeiliSearch from 'meilisearch';

export default {
  async mounted() {
    let token;
    if(isLoggedIn())
      token = getToken();
    let games = [] as any[];
    await axios
      .get("http://localhost:8080/api/game", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => games = res.data)
      .catch(error => console.log(error));
    
    let meiliGames = [] as Game[];
    games.forEach(async (game) => {
      await this.client
        .index("games")
        .getDocument(game.game_id)
        .then(res => {
          res.status = game.status;
          meiliGames.push(res as Game);
          this.loading = false;
        })
        .catch(err => console.log(err));
    });
    setTimeout(() => {
      this.games = meiliGames;
    }, games.length * 30)
  },
  data() {
    return {
      games: [] as Game[],
      client: new MeiliSearch({ host: "http://localhost:7700"}),
      loading: true
    }
  },
  computed: {
    owned: function() {
      return this.games.filter(game => game.status === "owned");
    },
    wishlisted: function() {
      return this.games.filter(game => game.status === "wishlisted");
    },
    completed: function() {
      return this.games.filter(game => game.status === "completed");
    }
  }
}
</script>

<template>
  <div class="game" v-if="loading">Loading your games...</div>

  <div class="library-container" v-else>

    <div class="section">
      <h2>Owned games:</h2>
      <div class="drawer">
        <div class="game no-game" v-if="owned.length === 0">No games here yet!</div>
        <div v-for="game in owned" class="game">
          <img :src="game.header_image" alt="game header image">
          <p>{{ game.name }}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Wishlisted games:</h2>
      <div class="drawer">
        <div class="game no-game" v-if="wishlisted.length === 0">No games here yet!</div>
        <div v-for="game in wishlisted" class="game">
          <img :src="game.header_image" alt="game header image">
          <p>{{ game.name }}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Completed games:</h2>
      <div class="drawer">
        <div class="game no-game" v-if="completed.length === 0">No games here yet!</div>
        <div v-for="game in completed" class="game">
          <img :src="game.header_image" alt="game header image">
          <p>{{ game.name }}</p>
        </div>
      </div>

    </div>

  </div>

</template>

<style scoped>
.library-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.drawer {
  display: flex;
  overflow-x: scroll;
  gap: 2rem;
  padding-bottom: 1rem;
  width: 100%;
}

.game {
  width: 15rem;
  min-height: 10rem;
}

.no-game {
  display: flex;
  align-items: center;
}

img {
  width: 15rem;
}
</style>