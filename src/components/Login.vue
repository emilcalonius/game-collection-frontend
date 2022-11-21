<script lang="ts">
import { RouterLink } from "vue-router";
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      username: "",
      password: "",
      showError: false
    }
  },
  methods: {
    login(e: MouseEvent) {
      e.preventDefault();
      axios
        .post("http://localhost:8080/api/auth/login", {
          name: this.username,
          password: this.password
        })
        .then(function(response) {
          console.log(response);
          document.cookie = "token=" + response.data["jwt-token"];
          router.push("/");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>

<template>
<div action="" class="login-form">
  <h1>Log in to the video game collection app</h1>
  <form>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" placeholder="Password" type="password" />
    <p v-if="showError" class="error">Wrong username or password!</p>
    <button @click="e => login(e)">Login</button>
  </form>
  <br />
  <h2>New user?</h2>
  <RouterLink class="register" to="/register">Register new account</RouterLink>
</div>
</template>

<style scoped>
.login-form, form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  width: 10rem;
  border-radius: 10px;
  height: 2rem;
  text-align: center;
}

button {
  width: 4rem;
}

.register {
  width: max-content;
}

.error {
  color: red;
}
</style>
