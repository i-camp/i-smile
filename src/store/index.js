import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import Game from '@/store/modules/game'
import User from '@/store/modules/user'
import Shots from '@/store/modules/shots'

const Store = new Vuex.Store({
    modules: {
        Game,
        User,
        Shots
    }
});

export default Store;
