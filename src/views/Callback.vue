<template>
  <main>
    Loading...
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class Home extends Vue {
  mounted() {
    if (!this.$route.query.code) return this.$router.replace("/");
    axios
      .post(
        "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",
        {
          client_id: "Iv1.a77202ac17a2de57",
          client_secret: "ff361016d8535ca55ec7a75c7c77f8f5b1912447",
          code: this.$route.query.code
        }
      )
      .then(response => {
        if (!response.data) throw new Error();
        const token = response.data.split("access_token=")[1].split("&")[0];
        this.$store.commit("setToken", token);
        this.$router.push("/");
      })
      .catch(error => {
        console.log("Got error", error);
      });
  }
}
</script>

<style lang="scss" scoped>
input,
button {
  font: inherit;
  padding: 1rem 1.5rem;
  border-radius: 0.25rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
}
input {
  margin-top: 1rem;
  border: 1px solid #ddd;
  display: block;
  width: 100%;
}
button {
  border: 0;
  background-color: #333;
  color: #fff;
}
</style>
