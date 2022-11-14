<script lang="ts">
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

export default {
  data() {
    return {
      client: instantMeiliSearch("http://localhost:7700"),
      searchTerm: ""
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
        <img :src="item['Header image']" alt="game-header-image" />
        <h2 class="game-name">{{ item.Name }}</h2>
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
</style>