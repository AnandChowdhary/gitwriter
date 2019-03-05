<template>
  <main>
    <div>
      <input :value="file.path" disabled />
      <textarea v-model="content" rows="20" />
      <button type="button" @click.prevent="save" :disabled="loading">
        <span v-if="loading">Saving...</span>
        <span v-else>Save</span>
      </button>
      <button type="button" @click.prevent="deleteFile" :disabled="loading">
        <span>Delete</span>
      </button>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class Home extends Vue {
  @Prop() file!: any;
  @Prop() token!: any;
  @Prop() repo!: string;
  @Prop() path!: string;
  private loading: boolean = false;
  private content: string = "";
  private sha: string = "";
  mounted() {
    this.sha = this.file.sha;
    this.content = this.decode(this.file.content);
  }
  decode(text: string) {
    return atob(text);
  }
  save() {
    this.loading = true;
    const data = {
      content: btoa(this.content),
      sha: this.sha,
      message: "Update using GitWriter"
    };
    axios
      .put(
        `https://api.github.com/repos/${this.repo}/contents/${
          this.path
        }?access_token=${this.token}`,
        data,
        {
          headers: {
            "User-Agent": "GitWriter"
          }
        }
      )
      .then(response => {
        this.sha = response.data.content.sha;
      })
      .catch(error => console.log(error))
      .then(() => (this.loading = false));
  }
  deleteFile() {
    this.loading = true;
    const data = {
      sha: this.sha,
      message: "Update using GitWriter"
    };
    axios
      .delete(
        `https://api.github.com/repos/${this.repo}/contents/${
          this.path
        }?access_token=${this.token}`,
        {
          headers: {
            "User-Agent": "GitWriter"
          }
        }
      )
      .then(() => {
        this.$router.push(`/repos/${btoa(this.repo)}/${btoa("/")}`);
      })
      .catch(error => console.log(error))
      .then(() => (this.loading = false));
  }
}
</script>

<style lang="scss" scoped>
input,
textarea {
  font: inherit;
  padding: 1rem 1.5rem;
  border-radius: 0.25rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
  margin-top: 1rem;
  border: 1px solid #ddd;
  display: block;
  width: 100%;
}
input:disabled {
  background-color: whitesmoke;
}
button {
  font: inherit;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
  box-sizing: border-box;
  margin-top: 1rem;
  background-color: whitesmoke;
  color: #000;
  &:disabled {
    opacity: 0.5;
  }
}
</style>
