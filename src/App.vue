<template>
  <div id="app">
    <header>
      <router-link class="logo" to="/">GitWriter</router-link>
    </header>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
#app {
  font: menu;
  font-size: 100%;
  max-width: 720px;
  margin: 2rem auto;
}
header {
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
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
