import Storage from '@/utils/storage'
import Store from '@/store/index'

const USER_KEY = 'i-smile:user';

class User extends Storage {
  constructor() {
    super();
    this.user = this.getStorage(USER_KEY);
    this.init();
  }

  init() {
    if (this.hasUser()) {
      this.mapState();
    }
  }

  mapState() {
    Store.dispatch('User/setUser',
      this.user.name,
      this.user.language,
      this.user.uuid
    ).then();
  }

  hasUser() {
    return (this.user !== undefined)
  }

  setUser(name, language, uuid) {
    let data = {
      name: name,
      language: language,
      uuid: uuid,
    }
    let dt = new Date();
    // 1day expier
    this.setStorage(USER_KEY, data, dt.setDate(dt.getDate() + 1));
    this.user = this.getStorage(USER_KEY);
    this.mapState();
  }
}
export default new User();
