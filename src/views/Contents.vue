<template>
  <main>
    <div v-if="loading">Loading...</div>
    <Writer
      v-else-if="data.type === 'file'"
      :file="data"
      :token="token"
      :repo="repo"
      :path="path"
      >{{ data }}</Writer
    >
    <ul v-else>
      <li v-for="(file, index) in data" :key="`file_${index}`">
        <router-link :to="`/repos/${encode(repo)}/${encode(file.path)}`">
          <span>{{ file.name }}</span>
        </router-link>
      </li>
      <p>
        <!-- <button>{{page}}</button> -->
        <!-- <button v-if="page > 1" @click="page--">&larr; Prev</button>
        <button v-if="data.length === 30" @click="page++">Next &rarr;</button> -->
      </p>
    </ul>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import Writer from "@/components/Writer.vue";

@Component({
  components: {
    Writer
  }
})
export default class Home extends Vue {
  private token: string = "";
  private data: any = {};
  private loading: boolean = false;
  private repo: string = "";
  private path: string = "";
  mounted() {
    if (!this.$store.state.token) return this.$router.replace("/");
    this.token = this.$store.state.token;
    this.repo = atob(this.$route.params.repo);
    this.path = atob(this.$route.params.path);
    this.loadData();
  }
  loadData() {
    this.loading = true;
    axios
      .get(
        `https://api.github.com/repos/${this.repo}/contents/${
          this.path
        }?access_token=${this.token}`,
        {
          headers: {
            "User-Agent": "GitWriter"
          }
        }
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
