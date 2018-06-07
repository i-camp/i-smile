export default {
  namespaced: true,
  state: {
    name: '',
    uuid: '',
  },
  getters: {},
  mutations: {
    setUser (state, user) {
      state.name = user.name;
      state.uuid = user.uuid;
    }
  },
  actions: {
    setUser({ commit }, name, uuid) {
      let payload = {
        name: name,
        uuid: uuid,
      };
      commit('setUser', payload);
    }
  },
}
