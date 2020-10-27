import Vue from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import db from './datastore'
Vue.config.productionTip = false
import store from './store'
Vue.prototype.$db = db
Vue.use(Vuex);

new Vue({
  router,
store,
  render: h => h(App)
}).$mount('#app')

store.commit('increment')