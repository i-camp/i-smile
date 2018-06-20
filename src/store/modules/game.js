import firebaseApp from '@/utils/firebase'

export default {
  namespaced: true,
  state: {
    startedAt: null,
    finishedAt: null,
  },
  getters: {
    currentGame: state => {
      return state;
    },
  },
  mutations: {
    setGame (state, payload) {
      state.startedAt  = payload.startedAt;
      state.finishedAt = payload.finishedAt;
    }
  },
  actions: {
    initGame({ commit }) {
      let currentGamesRef = firebaseApp.database().ref(`/currentGame`);
      return currentGamesRef.on('value', snapshot => {
        let game = snapshot.val();
          if (game !== undefined) {
            let payload = {
              startedAt: game.startedAt,
              finishedAt: game.finishedAt,
            };
            commit('setGame', payload);
          }
      });
      
    }
  },
}
