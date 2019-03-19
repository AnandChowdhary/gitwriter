<template>
  <main>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <form>
        <input type="search" @input="filter" v-model="filterText" placeholder="Find your repo...">
      </form>
      <ul class="list">
        <li v-for="(repo, index) in filteredData" :key="`repo_${index}`">
          <router-link :to="`/repos/${encode(repo.full_name)}/${encode('/')}`">
            <span>{{ repo.full_name }}</span>
          </router-link>
        </li>
        <!-- <p>
          <button>{{ page }}</button>
          <button v-if="page > 1" @click="page--">&larr; Prev</button>
          <button v-if="data.length === 30" @click="page++">Next &rarr;</button>
        </p> -->
      </ul>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class Home extends Vue {
  private token: string = "";
  private data: any = [];
  private filteredData: any = [];
  private page: number = 1;
  private loading: boolean = false;
  private filterText: string = "";
  @Watch("page")
  onPageChanged() {
    this.loadData();
  }
  mounted() {
    if (!this.$store.state.token) return this.$router.replace("/");
    this.token = this.$store.state.token;
    if (this.$store.state.repos.length) {
      this.data = this.$store.state.repos;
      this.filter();
    } else {
      this.loadData();
    }
  }
  loadData(page?: number) {
    this.loading = true;
    axios
      .get(
        `https://api.github.com/user/repos?access_token=${this.token}&page=${
          page || this.page
        }`
      )
      .then(response => {
        this.data = [ ...this.data, ...response.data ];
        if (response.data.length === 30) {
          this.loadData((page || this.page) + 1);
        } else {
          this.$store.commit("setRepos", this.data);
        }
        this.filter();
      })
      .catch(error => console.log(error))
      .then(() => (this.loading = false));
  }
  encode(data: string) {
    return btoa(data).replace(/=/g, "");
  }
  filter() {
    if (this.filterText) {
      this.filteredData = this.data.filter((repo: any) => repo.full_name.includes(this.filterText));
    } else {
      this.filteredData = this.data;
    }
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
  border: 1px solid #ddd;
  margin-top: 1rem;
  background-color: whitesmoke;
  color: #000;
}
</style>
