import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showPreloader: true,
    build: false,
    peoplesPagination: "",
    searchQuery: "",
    searchPeoples: [],
    loading: false,
    closePopUp: true,
    person: "",
    searchCount: null
  },
  mutations: {
    SET_LOADED_PEOPLES(state, payload) {
      state.peoples = payload;
      console.log(state.peoples);
    },
    SET_LOADED_PEOPLES_PAGINATION(state, payload) {
      state.peoplesPagination = payload;
      //console.log(state.itemsPagination)
    },
    SET_SEARCH_QUERY(state, searchQuery) {
      state.searchQuery = searchQuery;
      //console.log(state.searchQuery);
    },
    SET_SEARCH_PEOPLES(state, searchPeoples) {
      state.searchPeoples = searchPeoples.results;
      state.searchCount = searchPeoples.count;
      //console.log(state.searchPeoples);
    },
    RESET_SEARCH_PEOPLES(state) {
      state.searchPeoples = null;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    }
  },
  actions: {
    setSearchQuery({ commit }, searchQuery) {
      commit("SET_SEARCH_QUERY", searchQuery);
    },
    async search({ commit, state }) {
      commit("SET_LOADING", true);
      try {
        axios
          .get(`https://swapi.co/api/people/?search=${state.searchQuery}`)
          .then(response => {
            commit("SET_SEARCH_PEOPLES", response.data);
            console.log(response);
          });
      } catch (e) {
        commit("RESET_SEARCH_PEOPLES");
      }
    },
    LOAD_PEOPLES({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get("https://swapi.co/api/people/")
          .then(response => {
            resolve(response);
            commit("SET_LOADED_PEOPLES", response.data.results);
            commit("SET_LOADED_PEOPLES_PAGINATION", response.data);
            //console.log(response)
            commit("SET_LOADING", true);
          })
          .catch(error => {
            reject(error);
            console.log(error);
          });
      });
    },
    LOAD_PEOPLES_PAGINATION({ commit }, { pagination }) {
      return new Promise((resolve, reject) => {
        axios
          .get(pagination)
          .then(response => {
            resolve(response);
            commit("SET_LOADED_PEOPLES_PAGINATION", response.data);
          })
          .catch(error => {
            reject(error);
            console.log(error);
          });
      });
    }
  },
  getters: {
    getPeoples(state) {
      return state.peoples;
    },
    getPeoplesPagination: state => {
      return state.peoplesPagination;
    }
  }
});
