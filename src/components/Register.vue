<script lang="ts">
import axios from "axios";
import router from "@/router";
export default {
  data() {
    return {
      username: "",
      passwordOne: "",
      passwordTwo: "",
      noMatch: false
    }
  },
  methods: {
    register(e: MouseEvent) {
      e.preventDefault();
      if(this.passwordOne !== this.passwordTwo) {
        this.noMatch = true;
        return;
      }
      axios
        .post(import.meta.env.VITE_BACKEND_HOST + "/api/auth/register", {
          name: this.username,
          password: this.passwordOne
        })
        .then(function(response) {
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
<div class="register-form">
  <h1>Create a new account</h1>
  <form>
    <input v-model="username" placeholder="Username" />
    <input v-model="passwordOne" placeholder="Password" type="password" />
    <input v-model="passwordTwo" placeholder="Confirm password" type="password" />
    <p v-if="noMatch" class="error">Passwords do not match!</p>
    <button @click="e => register(e)">Sign up</button>
  </form>
</div>
</template>

<style scoped>
.register-form {
  padding: 1rem;
}

.register-form, form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-form {
  padding: 1rem;
}

input {
  width: 20rem;
  border-radius: 10px;
  height: 3rem;
  text-align: center;
  font-size: 1.5rem;
}

button {
  width: 10rem;
}

.error {
  font-size: 1.5rem;
  color: rgb(226, 107, 107);
}

@media only screen and (max-width: 500px) {
  button {
    width: 100%;
  }

  input {
    width: 100%
  }
}
</style>