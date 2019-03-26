<template>
  <div id="app">
    <header>
      <router-link class="logo" to="/">GitWriter</router-link>
      <div v-if="hasToken">
        <button type="button" @click="forgetRepos">Sync repos</button>
        <button type="button" @click="forgetToken">Logout</button>
      </div>
    </header>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters(["token"])
  }
})
export default class App extends Vue {
  token!: string;
  hasToken: boolean = false;
  @Watch("token")
  onTokenChanged() {
    this.updateNav();
  }
  mounted() {
    this.updateNav();
  }
  updateNav() {
    this.hasToken = !!this.token;
  }
  forgetToken() {
    this.$store.commit("logout");
    this.$router.push("/");
  }
  forgetRepos() {
    this.$store.commit("resetRepos");
    this.$router.push("/repos");
    location.reload();
  }
}
</script>

<style lang="scss" scoped>
#app {
  font: menu;
  font-size: 100%;
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 2rem;
  line-height: 1.5;
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

<style lang="scss">
ul.list {
  line-height: 2;
}
a {
  color: inherit;
}
.cm-formatting-header {
  opacity: 0.25;
}
</style>
