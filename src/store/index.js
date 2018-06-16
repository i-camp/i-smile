import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import Game from '@/store/modules/game'
import User from '@/store/modules/user'

const Store = new Vuex.Store({
    modules: {
        Game,
        User
    }
});

export default Store;
