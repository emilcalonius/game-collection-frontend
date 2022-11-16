<script lang="ts">
import axios from 'axios';
import { isLoggedIn, getToken } from '@/utils/jwtUtil';

export default {
  props: {
    user: Object
  },
  methods: {
    async clickSaveButton(e: MouseEvent) {
      e.preventDefault();
      if(isLoggedIn()) {
        const token = getToken();
        if(typeof token === "string") {
          this.token = token;
        }
      }
      console.log(this.token)
      await axios
        .patch("http://localhost:8080/api/user", {
          avatar: this.avatar,
          bio: this.bio,
        }, {
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        })
        .then(res => console.log(res))
        .catch(error => console.log(error));

      this.$emit('click-show-edit', false);
      window.location.reload();
    }
  },
  data() {
    return {
      token: "",
      avatar: this.user?.avatar ?? "",
      bio: this.user?.bio ?? ""
    }
  }
}
</script>

<template>
  <div v-if="user !== undefined" class="edit-container">
    <h2>{{user.name}}</h2>
    <form>
      <label for="avatar">Avatar:</label>
      <input v-model="avatar" placeholder="URL to avatar" id="avatar" />
      <label for="bio">Bio:</label>
      <textarea v-model="bio" placeholder="Write your bio here" rows="5" id="bio" />
      <button @click="e => clickSaveButton(e)">Save</button>
    </form>
  </div>
</template>

<style scoped>
.edit-container, form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  width: 20rem;
  border-radius: 10px;
  height: 2rem;
}

textarea {
  width: 20rem;
  border-radius: 10px;
}

button {
  width: 5rem;
  border-radius: 10px;
}
</style>