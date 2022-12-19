<script lang="ts">
import axios from 'axios';
import { isLoggedIn, getToken } from '@/utils/jwtUtil';
import router from '@/router';

export default {
  props: {
    user: Object
  },
  methods: {
    clickCancelButton(e: MouseEvent) {
      e.preventDefault();
      router.push("/profile");
    },
    async clickSaveButton(e: MouseEvent) {
      e.preventDefault();
      if(isLoggedIn()) {
        const token = getToken();
        if(typeof token === "string") {
          this.token = token;
        }
      }
      await axios
        .patch(import.meta.env.VITE_BACKEND_HOST + "/api/user", {
          avatar: this.avatar,
          bio: this.bio,
        }, {
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        })
        .then(res => console.log(res))
        .catch(error => console.log(error));

      router.push("/profile");
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
      <div class="profile-edit-btns">
        <button class="cancel" @click="e => clickCancelButton(e)">Cancel</button>
        <button @click="e => clickSaveButton(e)">Save</button>
      </div>  
    </form>
  </div>
</template>

<style scoped>
.cancel {
  border-radius: 0;
  background-color: transparent;
  border: 0;
  color: rgb(0, 189, 160);
  width: 7rem;
}

@media(hover: hover) {
  .cancel:hover {
    background-color: rgba(0, 189, 161, 0.096);
  }
}

.profile-edit-btns {
  display: flex;
  gap: 1rem;
}

.edit-container, form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  width: 25rem;
  border-radius: 10px;
  height: 3rem;
  font-size: 1.5rem;
}

textarea {
  width: 25rem;
  border-radius: 10px;
  font-size: 1.5rem;
}

button {
  width: 5rem;
  border-radius: 10px;
}

@media only screen and (max-width: 500px) {
  input, textarea {
    width: 100%;
  }
}
</style>