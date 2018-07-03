import firebaseApp from '@/utils/firebase'

export default {
  namespaced: true,
  state: {
    shots: [],
  },
  mutations: {
    setSnaps (state, payload) {
      state.shots.push(payload);
    }
  },
  actions: {
    initShots({ commit }, { uuid }) {
      let snapEventsRef = firebaseApp.database().ref(`/snapEvents`);
      return snapEventsRef
        .orderByChild('photographerId')
        .equalTo(uuid)
        .on('child_added', snapshot => {
          commit('setSnaps', snapshot.val())
      });
    },
    hasShot({ state }, uuid) {
      return new Promise((resolve, reject) => {
        state.shots.forEach(shot => {
          if (shot.subjectId === uuid) {
            reject('already has shot photo');
          }
        });
        resolve('ok');
      });
    }
  },
}
