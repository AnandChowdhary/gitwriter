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
    <ul class="list" v-else>
      <li v-for="(file, index) in data" :key="`file_${index}`">
        <router-link :to="`/${repo}/${file.path}`">
          <span
            v-if="file.path.indexOf('.') > -1"
            :style="
              `background-image: url('https://unpkg.com/file-icon-vectors@1.0.0/dist/icons/vivid/${
                file.path.split('.')[file.path.split('.').length - 1]
              }.svg')`
            "
            class="bg-icon"
          ></span>
          <span v-else class="bg-icon"></span>
          <span>{{ file.name }}</span>
        </router-link>
      </li>
    </ul>
    <div v-if="data.type !== 'file'">
      <label>
        <input
          type="text"
          v-model="newFile"
          class="new-file"
          placeholder="Enter file name"
        />
        <router-link :to="`/${repo}/${trimchar((path || '') + newFile, '/')}`"
          >Create a new file</router-link
        >
      </label>
    </div>
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
  private newFile: string = "";
  mounted() {
    if (!this.$store.state.token) return this.$router.replace("/");
    this.token = this.$store.state.token;
    this.repo = `${this.$route.params.owner}/${this.$route.params.repo}`;
    this.path = this.$route.fullPath.split(this.repo + "/")[1];
    this.loadData();
  }
  trimchar(string: string, charToRemove: string) {
    while (string.charAt(0) == charToRemove) {
      string = string.substring(1);
    }
    while (string.charAt(string.length - 1) == charToRemove) {
      string = string.substring(0, string.length - 1);
    }
    return string;
  }
  loadData() {
    this.loading = true;
    axios
      .get(
        `https://api.github.com/repos/${this.repo}/contents/${this.path ||
          ""}?access_token=${this.token}`
      )
      .then(response => {
        this.data = response.data;
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          if (error.response.data.message === "Not Found") {
            this.data = {
              type: "file",
              path: this.path,
              content: btoa("")
            };
          }
        }
      })
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
.bg-icon {
  width: 1.25rem;
  height: 1.5rem;
  vertical-align: middle;
  display: inline-block;
  margin-right: 0.75rem;
  background-image: url("https://unpkg.com/file-icon-vectors@1.0.0/dist/icons/vivid/folder.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
.new-file {
  font: inherit;
  margin-right: 1rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.2rem;
}
</style>
