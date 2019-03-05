<template>
  <main>
    <form @submit.prevent="login">
      <label>Token</label>
      <input v-model="token" type="text" placeholder="Enter your token" required />
      <button type="submit">Start using GitWriter &rarr;</button>
    </form>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {
  private token: string = "";
  mounted() {
    if (this.$store.state.token) {
      this.$router.replace("/repos");
    }
  }
  login() {
    this.$store.commit("setToken", this.token);
    this.$router.push("/repos");
  }
}
</script>

<style lang="scss" scoped>
input,
button {
  font: inherit;
  padding: 1rem 1.5rem;
  border-radius: 0.25rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
}
input {
  margin-top: 1rem;
  border: 1px solid #ddd;
  display: block;
  width: 100%;
}
button {
  border: 0;
  background-color: #333;
  color: #fff;
}
</style>
