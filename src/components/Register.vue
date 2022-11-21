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
        .post("http://localhost:8080/api/auth/register", {
          name: this.username,
          password: this.passwordOne
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
.register-form, form {
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
  width: 5rem;
}

.error {
  color: red;;
}
</style>