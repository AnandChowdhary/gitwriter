import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    repos: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setRepos(state, repos) {
      state.repos = repos;
    },
    resetRepos(state) {
      state.repos = [];
    },
    logout(state) {
      state.token = null;
    }
  },
  getters: {
    token(state) {
      return state.token;
    }
  },
  actions: {},
  plugins: [createPersistedState()]
});
