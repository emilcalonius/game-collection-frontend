<script lang="ts">
export default {
  props: {
    user: Object
  }
}
</script>

<template>
  <div v-if="user !== undefined">
    <img :src="user.avatar" alt="profile picture">
    <p>{{user.name}}</p>
    <p>{{user.bio}}</p>
  </div>
</template>