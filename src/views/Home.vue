<template>
  <main>
    <button type="button" @click.prevent="login">
      Login with GitHub &rarr;
    </button>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {
  private token: string = "";
  mounted() {
    if (this.$store.state.token) {
      this.$router.replace("/repos");
    }
  }
  login() {
    const url = `https://github.com/login/oauth/authorize?client_id=Iv1.a77202ac17a2de57&redirect_uri=${encodeURIComponent(
      location.href + "callback"
    )}&scope=${encodeURIComponent("repo user")}`;
    window.location.href = url;
    // this.$store.commit("setToken", this.token);
    // this.$router.push("/repos");
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
