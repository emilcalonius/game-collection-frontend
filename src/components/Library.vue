<script lang="ts">
import axios from 'axios';
import { isLoggedIn, getToken } from '@/utils/jwtUtil';
import type { Game } from '@/models/game';
import MeiliSearch from 'meilisearch';
import router from '@/router';

export default {
  async mounted() {
    // Check if user is logged in and get games from api and meilisearch db
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

    if(games.length === 0) {
      this.loading = false;
      return;
    }
    let meiliGames = [] as Game[];
    games.forEach(async (game) => {
      await this.client
        .index("games")
        .getDocument(game.game_id)
        .then(res => {
          res.status = game.status;
          res.completed = game.completed;
          meiliGames.push(res as Game);
        })
        .catch(err => console.log(err));
    });
    setTimeout(() => {
      this.games = meiliGames;
      this.loading = false;
    }, games.length * 30);
    setTimeout(function() {
      // Show scroll buttons if content overflows
      document.querySelectorAll(".drawer").forEach(element => {
        if(element.scrollWidth > element.clientWidth) {
          const scrollButton: HTMLElement = element.lastElementChild as HTMLElement;
          scrollButton.style.display = "block";
        }
      });
    }, games.length * 31);
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
      return this.games.filter(game => game.completed === true);
    }
  },
  methods: {
    scrollDrawer(event: MouseEvent, direction: string) {
      const button: HTMLElement = event.target as HTMLElement;
      const drawer = button.parentElement;
      let amount = 0;
      if(direction === 'back') amount = -500;
      if(direction === 'forward') amount = 500;
      drawer?.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
      if(button.classList.contains("scroll-btn-right")) {
        if(drawer?.scrollLeft! + amount + drawer?.offsetWidth! >= drawer?.scrollWidth!) {
          button.style.display = "none";
        }
        const otherButton: HTMLElement = button.parentElement?.firstElementChild as HTMLElement;
        otherButton.style.display = "block";
      }
      if(button.classList.contains("scroll-btn-left")) {
        if(drawer?.scrollLeft! + amount <= 0) {
          button.style.display = "none";
        }
        const otherButton: HTMLElement = button.parentElement?.lastElementChild as HTMLElement;
        otherButton.style.display = "block";
      }
    },
    showGame(game: Game) {
      router.push(`/game/${game.id}`);
    },
  }
}
</script>

<template>
  <div class="library-container">

    <div class="section">
      <h2>Owned games:</h2>
      <div class="drawer">
        <img class="loading" v-if="loading" src="../assets/images/loading.gif" alt="loading gif">
        <div v-else class="game no-game" v-if="owned.length === 0">No games here yet...</div>
        <button class="scroll-btn scroll-btn-left" @click="(event) => scrollDrawer(event, 'back')">&lt;</button>
        <div v-for="game in owned" class="game">
          <img class="game-header" :src="game.header_image" alt="game header image" @click="showGame(game)">
          <p class="game-name">{{ game.name }}</p>
        </div>
        <button class="scroll-btn scroll-btn-right" @click="(event) => scrollDrawer(event, 'forward')">></button>
      </div>
    </div>

    <div class="section">
      <h2>Wishlisted games:</h2>
      <div class="drawer">
        <img class="loading" v-if="loading" src="../assets/images/loading.gif" alt="loading gif">
        <div v-else class="game no-game" v-if="wishlisted.length === 0">No games here yet...</div>
        <button class="scroll-btn scroll-btn-left" @click="(event) => scrollDrawer(event, 'back')">&lt;</button>
        <div v-for="game in wishlisted" class="game">
          <img class="game-header" :src="game.header_image" alt="game header image" @click="showGame(game)">
          <p class="game-name">{{ game.name }}</p>
        </div>
        <button class="scroll-btn scroll-btn-right" @click="(event) => scrollDrawer(event, 'forward')">></button>
      </div>
    </div>

    <div class="section">
      <h2>Completed games:</h2>
      <div class="drawer">
        <img class="loading" v-if="loading" src="../assets/images/loading.gif" alt="loading gif">
        <div v-else class="game no-game" v-if="completed.length === 0">No games here yet...</div>
        <button class="scroll-btn scroll-btn-left" @click="(event) => scrollDrawer(event, 'back')">&lt;</button>
        <div v-for="game in completed" class="game">
          <img class="game-header" :src="game.header_image" alt="game header image" @click="showGame(game)">
          <p class="game-name">{{ game.name }}</p>
        </div>
        <button class="scroll-btn scroll-btn-right" @click="(event) => scrollDrawer(event, 'forward')">></button>
      </div>

    </div>

  </div>

</template>

<style scoped>
.loading {
  width: 5rem;
}

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

.game-header {
  width: 15rem;
  transition: 300ms;
}

.game-header:hover {
  width: 16rem;
  cursor: pointer;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.733);
}

.game-name {
  opacity: 0;
  transition: 200ms;
}

.game-header:hover + .game-name {
  opacity: 100;
}

.section {
  height: 15rem;
}

.scroll-btn {
  position: sticky;
  z-index: 2;
  height: 5rem;
  display: none;
  margin-top: 1rem;
}

.scroll-btn-right {
  right: 0.5rem;
}

.scroll-btn-left {
  left: 0.5rem;
}
</style>