<template>
  <main>
    <div>
      <input :value="file.path" disabled />
      <textarea v-model="content" rows="20" />
      <button type="button" @click.prevent="save" :disabled="!dirty || loading">
        <span v-if="dirty">Save</span>
        <span v-else-if="loading">Saving...</span>
        <span v-else>No changes</span>
      </button>
      <button type="button" @click.prevent="deleteFile" :disabled="loading">
        <span>Delete</span>
      </button>
      <p v-if="lastSaved">Last saved {{ timeago(lastSaved) }}</p>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import axios from "axios";
import { Base64 } from "js-base64";
// @ts-ignore
import time from "time-ago";

function encode_utf8(s: string) {
  return Base64.encode(s);
}

function decode_utf8(s: string) {
  return Base64.decode(s);
}

@Component({})
export default class Home extends Vue {
  @Prop() file!: any;
  @Prop() token!: any;
  @Prop() repo!: string;
  @Prop() path!: string;
  private ready: boolean = false;
  private dirty: boolean = false;
  private loading: boolean = false;
  private content: string = "";
  private sha: string = "";
  private lastSaved: Date | boolean = false;
  @Watch("content")
  onContentChanged() {
    if (!this.ready) return;
    this.dirty = true;
    if (this.lastSaved && typeof this.lastSaved === "object") {
      if (this.lastSaved.getTime() + 60 * 1000 > new Date().getTime()) {
        return;
      }
    }
    this.save();
  }
  mounted() {
    this.sha = this.file.sha;
    this.content = this.decode(this.file.content);
    setInterval(() => this.$forceUpdate(), 1000);
    setTimeout(() => (this.ready = true), 10);
  }
  timeago(text: Date) {
    return time.ago(text);
  }
  decode(text: string) {
    return decode_utf8(text);
  }
  save() {
    this.loading = true;
    this.dirty = false;
    this.lastSaved = new Date();
    const data = {
      content: encode_utf8(this.content),
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
            // "User-Agent": "GitWriter"
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
            // "User-Agent": "GitWriter"
          }
        }
      )
      .then(() => {
        this.$router.push(`/repos/${encode_utf8(this.repo)}/${encode_utf8("/")}`);
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
