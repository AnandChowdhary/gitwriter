<template>
  <main>
    <div>
      <input :value="file.path" disabled />
      <markdown-editor
        required
        v-model="content"
        placeholder="Start writing here..."
      />
      <footer>
        <div
          style="display: flex; justify-content: center; align-items: center; margin-right: 1rem"
        >
          <input type="checkbox" id="auto" v-model="autosave" />
          <span
            ><label for="auto">Autosave every</label>
            <input type="number" v-model="autosaveTime" /> seconds</span
          >
        </div>
        <button
          type="button"
          @click.prevent="save"
          :disabled="!dirty || loading"
        >
          <span v-if="dirty">Save</span>
          <span v-else-if="loading">Saving...</span>
          <span v-else>No changes to save</span>
        </button>
        <button
          type="button"
          @click.prevent="deleteFile"
          :disabled="loading"
          class="delete"
        >
          <span>Delete this file</span>
        </button>
        <p v-if="dirty">You have unsaved changes.</p>
      </footer>
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
// import time from "time-ago";

const encode_utf8 = (s: string) => Base64.encode(s);
const decode_utf8 = (s: string) => Base64.decode(s);

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
  private interval: any;
  private listener: Function;
  private autosave: boolean = false;
  private autosaveTime: number = 120;
  @Watch("content")
  onContentChanged() {
    if (!this.ready) return;
    this.dirty = true;
  }
  constructor() {
    super();
    this.listener = (event: Event) => {
      if (this.dirty) {
        event.preventDefault();
        // @ts-ignore
        event.returnValue = "";
      }
    };
  }
  mounted() {
    this.sha = this.file.sha;
    this.content = this.decode(this.file.content);
    this.interval = setInterval(() => {
      this.$forceUpdate();
      let shouldSave = false;
      if (this.lastSaved && typeof this.lastSaved === "object") {
        if (
          this.lastSaved.getTime() + this.autosaveTime * 1000 <
            new Date().getTime() &&
          this.dirty
        ) {
          shouldSave = true;
        }
      } else if (this.dirty) {
        shouldSave = true;
      }
      if (!this.autosave) shouldSave = false;
      if (shouldSave) this.save();
    }, 1000);
    setTimeout(() => (this.ready = true), 10);
    axios
      .get("https://ipinfo.io/json?token=07089fada04d89")
      .then(response => {
        this.ipInfo = response.data;
      })
      .catch(() => {});
    // window.addEventListener("beforeunload", <any>this.listener);
  }
  decode(text: string) {
    return decode_utf8(text);
  }
  save() {
    this.loading = true;
    this.dirty = false;
    this.lastSaved = new Date();
    const ua = new UAParser().getResult();
    let message = `:memo: Edited using GitWriter \n ${ua.browser.name} ${
      ua.browser.major
    } on ${ua.os.name} ${ua.os.version}`;
    if (this.ipInfo) {
      message += ` in ${this.ipInfo.city}, ${this.ipInfo.country}`;
    }
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
        data
      )
      .then(response => {
        this.sha = response.data.content.sha;
      })
      .catch(() => alert("There was an error saving this!"))
      .then(() => (this.loading = false));
  }
  deleteFile() {
    const ask = window.confirm(`Are you sure you want to delete ${this.path}?`);
    if (!ask) return;
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
          data: {
            sha: this.sha,
            message: ":memo: Delete file using GitWriter"
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
  beforeDestroy() {
    // window.removeEventListener("beforeunload", <any>this.listener);
    clearInterval(this.interval);
  }
}
</script>

<style>
.CodeMirror-fullscreen,
.editor-preview-side {
  bottom: 5rem !important;
}
</style>

<style lang="scss" scoped>
main {
  margin-bottom: 5rem;
}
footer {
  background: whitesmoke;
  position: fixed;
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 1rem;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}
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
  &[type="number"] {
    display: inline-block;
    padding: 0;
    width: 3rem;
    text-align: center;
    margin: 0 0.5rem;
  }
  &[type="checkbox"] {
    display: inline-block;
    padding: 0;
    vertical-align: middle;
    margin: 0;
    margin-right: 0.5rem;
    width: auto;
  }
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
  background-color: whitesmoke;
  color: #000;
  &:disabled {
    opacity: 0.5;
  }
  &.delete {
    background-color: transparent;
    border: 0;
    color: #c0392b;
  }
}
</style>
