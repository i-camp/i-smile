import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'
import titleMixin from '@/title'
import User from '@/user'

User.init();

// import vuetify style
import 'vuetify/dist/vuetify.min.css'

// import submodule
import Store from '@/store/index'
import router from '@/routes'

// import component
import App from '@/App.vue'

import './registerServiceWorker'

Vue.use(Vuex)
Vue.use(Vuetify, {
  theme: {
    primary: "#FFC107",
    secondary: "#8D6E63",
    accent: "#4CAF50",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50",
  }
})
Vue.use(Vuelidate)
Vue.use(VueRouter)
Vue.mixin(titleMixin)

Vue.config.productionTip = false

new Vue({
  router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
