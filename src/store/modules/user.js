export default {
  namespaced: true,
  state: {
    name: '',
    uuid: '',
  },
  getters: {},
  mutations: {
    setUser (state, payload) {
      state.name     = payload.name;
      state.uuid     = payload.uuid;
    }
  },
  actions: {
    setUser({ commit }, { name, uuid }) {
      let payload = {
        name: name,
        uuid: uuid,
      };
      commit('setUser', payload);
    }
  },
}
