<script lang="ts">
import type { Game } from '@/models/game';
import MeiliSearch from 'meilisearch';
import UserGameInfo from './UserGameInfo.vue';

export default {
  data() {
    return {
      game: {} as Game,
      client: new MeiliSearch({
        host: import.meta.env.VITE_MEILISEARCH_HOST, 
        apiKey: import.meta.env.VITE_MEILISEARCH_KEY
      }),
      rating: 0,
      completed: false
    }
  },
  async mounted() {
    let game;
    let gameId = this.$route.params.id as string;
    await this.client
      .index("games")
      .getDocument(gameId)
      .then(res => game = res as Game)
      .catch(err => console.log(err));
    if(game !== undefined) {
      this.game = game;
      setTimeout(function() {
        // Show scroll buttons if content overflows
        const container = document.getElementById("screenshots");
        if(container?.scrollWidth! > container?.clientWidth!) {
          const scrollButton: HTMLElement = container?.lastElementChild as HTMLElement;
          scrollButton.style.display = "block";
        }
      }, 200);
    }
  },
  methods: {
    scrollScreenshots(event: MouseEvent, direction: string) {
      const button: HTMLElement = event.target as HTMLElement;
      const container = button.parentElement;
      let amount = 0;
      if(direction === 'back') amount = -500;
      if(direction === 'forward') amount = 500;
      container?.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
      if(button.classList.contains("scroll-btn-right")) {
        if(container?.scrollLeft! + amount + container?.offsetWidth! >= container?.scrollWidth!) {
          button.style.display = "none";
        }
        const otherButton: HTMLElement = button.parentElement?.firstElementChild as HTMLElement;
        otherButton.style.display = "block";
      }
      if(button.classList.contains("scroll-btn-left")) {
        if(container?.scrollLeft! + amount <= 0) {
          button.style.display = "none";
        }
        const otherButton: HTMLElement = button.parentElement?.lastElementChild as HTMLElement;
        otherButton.style.display = "block";
      }
    }
  },
  components: {
    UserGameInfo
  }
}
</script>

<template>
  <p v-if="Object.keys(game).length === 0">Game not found!</p>
  <div v-else class="container">
    <img class="header-img" :src="game.header_image" alt="">
    <UserGameInfo :game="game" />
    <h1>{{ game.name }}</h1>
    <div class="devs">
      <div class="developers">
        <h2>Developers:</h2>
        <p>{{ game.developers.join(", ") }}</p>
      </div>
      <div class="publishers">
        <h2>Publishers:</h2>
        <p>{{ game.publishers.join(", ") }}</p>
      </div>
    </div>
    <div class="categories">
      <div v-if="game.genres.length > 0" class="genres">
        <h3>Genres:</h3>
        <p>{{ game.genres.join(", ") }}</p>
      </div>
      <div v-if="game.tags.length > 0" class="tags">
        <h3>Tags:</h3>
        <p>{{ game.tags.join(", ") }}</p>
      </div>
    </div>
    <div class="release-date">
      <h3>Release date:</h3>
      <p>{{ game.release_date }}</p>
    </div>
    <h2>Description:</h2>
    <p>{{ game.about_the_game }}</p>
    <h2>Screenshots:</h2>
    <div class="screenshots" id="screenshots">
      <button class="scroll-btn scroll-btn-left" @click="(event) => scrollScreenshots(event, 'back')">&lt;</button>
      <img class="screenshot" v-for="gameScreenshot in game.screenshots" :src="gameScreenshot" alt="screenshot" />
      <button class="scroll-btn scroll-btn-right" @click="(event) => scrollScreenshots(event, 'forward')">></button>
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
  align-items: center;
}

.screenshot {
  width: 30rem;
}

.header-img {
  width: 20rem;
}

.scroll-btn {
  position: sticky;
  z-index: 2;
  height: 5rem;
  display: none;
}

.scroll-btn-right {
  right: 0.5rem;
}

.scroll-btn-left {
  left: 0.5rem;
}
</style>