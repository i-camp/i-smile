export default {
  namespaced: true,
  state: {
    name: '',
    language: null,
    uuid: '',
  },
  getters: {},
  mutations: {
    setUser (state, payload) {
      state.name     = payload.name;
      state.language = payload.language;
      state.uuid     = payload.uuid;
    }
  },
  actions: {
    setUser({ commit }, { name, language, uuid }) {
      let payload = {
        name: name,
        language: language,
        uuid: uuid,
      };
      commit('setUser', payload);
    }
  },
}
