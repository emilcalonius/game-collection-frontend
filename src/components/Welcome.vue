<script lang="ts">
export default {
  data() {
    return {

    }
  },
  methods: {
    isLoggedIn(): Boolean {
      return document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/) !== null;
    },
    getToken(): String | null | undefined {
      return (document.cookie.match(/^(?:.*;)?\s*token\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
    },
    getName(): String | null {
      const token = this.getToken();
      if(token == null || token == undefined) return null;
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload);

      return decodedToken.name;
    }
  }
}
</script>

<template>
  <p v-if="isLoggedIn()">Hello, {{getName()}}!</p>
  <p v-if="!isLoggedIn()">Not logged in</p>
</template>