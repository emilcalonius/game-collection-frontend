<script lang="ts">
import defaultAvatar from '../assets/images/blank_avatar.png';

export default {
  props: {
    user: Object,
  },
  methods: {
    clickEditButton() {
      this.$emit('click-show-edit', true);
    }
  },
  data() {
    return {
      defaultAvatar: defaultAvatar
    }
  }
}
</script>

<template>
  <div class="user-info-container" v-if="user !== undefined">
    <h2>Avatar:</h2>
    <div class="avatar-container">
      <img class="avatar" 
        :src="user.avatar === '' 
          || user.avatar === null 
          ? defaultAvatar 
          : user.avatar" 
        alt="profile picture"
      >
    </div>
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
  width: 10rem;
}

.avatar {
  object-fit: cover;
  width: 10rem;
  height: 10rem;
}

.avatar-container {
  width: 10rem;
  height: 10rem;
  overflow: hidden;
  border-radius: 50%;
}
</style>