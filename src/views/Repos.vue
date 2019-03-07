<template>
  <main>
    <div v-if="loading">Loading...</div>
    <ul class="list" v-else>
      <li v-for="(repo, index) in data" :key="`repo_${index}`">
        <router-link :to="`/repos/${encode(repo.full_name)}/${encode('/')}`">
          <span>{{ repo.full_name }}</span>
        </router-link>
      </li>
      <p>
        <button>{{ page }}</button>
        <button v-if="page > 1" @click="page--">&larr; Prev</button>
        <button v-if="data.length === 30" @click="page++">Next &rarr;</button>
      </p>
    </ul>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class Home extends Vue {
  private token: string = "";
  private data: any = {};
  private page: number = 1;
  private loading: boolean = false;
  @Watch("page")
  onPageChanged() {
    this.loadData();
  }
  mounted() {
    if (!this.$store.state.token) return this.$router.replace("/");
    this.token = this.$store.state.token;
    if (this.$store.state.repos.length) {
      this.data = this.$store.state.repos;
    } else {
      this.loadData();
    }
  }
  loadData() {
    this.loading = true;
    axios
      .get(
        `https://api.github.com/user/repos?access_token=${this.token}&page=${
          this.page
        }`
      )
      .then(response => {
        this.data = response.data;
      })
      .catch(error => console.log(error))
      .then(() => (this.loading = false));
  }
  encode(data: string) {
    return btoa(data).replace(/=/g, "");
  }
}
</script>

<style lang="scss" scoped>
input,
button {
  font: inherit;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
  box-sizing: border-box;
  margin-top: 1rem;
  background-color: whitesmoke;
  color: #000;
}
</style>
