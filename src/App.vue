<template>
  <div id="app">
    <header>
      <router-link class="logo" to="/">GitWriter</router-link>
      <div>
        <button type="button" @click="forgetToken">Forget token</button>
        <!-- <button type="button" @click="forgetRepos">Forget repos</button> -->
      </div>
    </header>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
  forgetToken() {
    this.$store.commit("logout");
    this.$router.push("/");
  }
  forgetRepos() {
    this.$store.commit("resetRepos");
    this.$router.push("/repos");
  }
}
</script>

<style lang="scss" scoped>
#app {
  font: menu;
  font-size: 100%;
  max-width: 720px;
  margin: 2rem;
}
header {
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  button {
    font: inherit;
    border: 0;
    padding: 0;
    margin-top: 1rem;
    + button {
      margin-left: 1rem;
    }
  }
  a {
    font-weight: bold;
    color: inherit;
    text-decoration: none;
    &.logo {
      font-size: 125%;
    }
  }
}
</style>
