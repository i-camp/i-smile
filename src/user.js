import firebaseApp from '@/utils/firebase'
import Storage from '@/utils/storage'
import Store from '@/store/index'

const USER_KEY = 'i-smile:user';

class User extends Storage {
  constructor() {
    super();
    this.user = this.getStorage(USER_KEY);
  }

  init() {
    if (this.hasUser()) {
      this.mapState();
    }
  }

  mapState() {
    Store.dispatch('User/setUser', this.user).then();
    Store.dispatch('Shots/initShots', this.user).then();
  }

  hasUser() {
    return (this.user !== undefined)
  }

  setUser(name, uuid) {
    return new Promise((resolve) => {
      this.setFirebase(name, uuid).then(() => {
        let data = {
          name: name,
          uuid: uuid,
        }
        let dt = new Date();
        // 1day expier
        this.setStorage(USER_KEY, data, dt.setDate(dt.getDate() + 1));
        this.user = this.getStorage(USER_KEY);
        this.mapState();
        resolve(true);
      });
    });
  }

  setFirebase(name, uuid) {
    let playersRef = firebaseApp.database().ref(`players/${uuid}`);
    return playersRef.set({name: name,},error => {
      if (error) {
        throw error;
      } else {
        return true;
      }
    });
  }
}
export default new User();
