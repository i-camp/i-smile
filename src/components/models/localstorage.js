export default class localStorage {

  setStorage(key, value, expire) {
    let data;
    if (expire !== undefined) {
      data = {
        expire: expire,
        value: value
      };
    } else {
      data = value;
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  getStorage(key) {
    let s = localStorage[key];
    if (s === undefined) {
      return undefined;
    }
    s = JSON.parse(s);
    if (new Date(s.expire) > new Date()) {
      return s.value;
    } else {
      localStorage.removeItem(key);
      return undefined;
    }
  }
}