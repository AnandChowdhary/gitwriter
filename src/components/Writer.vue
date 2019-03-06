<template>
  <main>
    <div>
      <input :value="file.path" disabled />
      <markdown-editor
        required
        v-model="content"
        placeholder="Start writing here..."
      />
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
import UAParser from "ua-parser-js";
// @ts-ignore
import markdownEditor from "vue-simplemde/src/markdown-editor";
// @ts-ignore
import time from "time-ago";

function encode_utf8(s: string) {
  return Base64.encode(s);
}

function decode_utf8(s: string) {
  return Base64.decode(s);
}

@Component({
  components: {
    markdownEditor
  }
})
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
  private ipInfo?: any;
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
    axios
      .get("https://ipinfo.io/json?token=07089fada04d89")
      .then(response => {
        this.ipInfo = response.data;
      })
      .catch(() => {});
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
    const ua = new UAParser().getResult();
    let message = `Edited using GitWriter (${ua.browser.name} ${
      ua.browser.major
    } on ${ua.os.name} ${ua.os.version}`;
    if (this.ipInfo) {
      message += ` in ${this.ipInfo.city}, ${this.ipInfo.country}`;
    }
    message += ")";
    const data = {
      content: encode_utf8(this.content),
      sha: this.sha,
      message
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
      .catch(() => alert("There was an error saving this!"))
      .then(() => (this.loading = false));
  }
  deleteFile() {
    this.loading = true;
    const data = {
      sha: this.sha,
      message: "Delete file using GitWriter"
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
        this.$router.push(
          `/repos/${encode_utf8(this.repo)}/${encode_utf8("/")}`
        );
      })
      .catch(() => alert("There was an error deleting this file"))
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
