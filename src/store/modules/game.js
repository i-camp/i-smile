import firebaseApp from '@/utils/firebase'

export default {
  namespaced: true,
  state: {
    id: null,
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
      state.id         = payload.id;
      state.startedAt  = payload.startedAt;
      state.finishedAt = payload.finishedAt;
    }
  },
  actions: {
    initGame({ commit }) {
      let currentGamesRef = firebaseApp.database().ref(`/currentGames`);
      let gamesRef        = firebaseApp.database().ref(`/games`);
      currentGamesRef.once('value').then(snapshot => {
        let currentId = snapshot.val();
        gamesRef.on('value', snapshot => {
          let games = snapshot.val();
          for (let key in games) {
            if (currentId === games[key].id) {
              let payload = {
                id: games[key].id,
                startedAt: games[key].startedAt,
                finishedAt: games[key].finishedAt,
              };
              commit('setGame', payload);
            }
          }
        });
      });
      
    }
  },
}
