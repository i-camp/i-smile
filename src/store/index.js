import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import User from '@/store/modules/user'

const Store = new Vuex.Store({
    modules: {
        User
    }
});

export default Store;
