<script lang="ts">
export default {
  props: {
    user: Object
  },
  methods: {
    clickEditButton() {
      this.$emit('click-show-edit', true);
    }
  }
}
</script>

<template>
  <div class="user-info-container" v-if="user !== undefined">
    <h2>Avatar:</h2>
    <img :src="user.avatar" alt="profile picture">
    <h2>Username:</h2>
    <p>{{user.name}}</p>
    <h2>Bio:</h2>
    <p>{{user.bio ?? "No bio yet"}}</p>
    <button @click="clickEditButton()">Edit profile</button>
  </div>
</template>

<style scoped>
.user-info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  width: 5rem;
  border-radius: 10px;
}
</style>