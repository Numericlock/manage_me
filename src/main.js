import Vue from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import db from './datastore'
import is_empty from './utils/is_empty'
Vue.config.productionTip = false
import store from './store'
Vue.prototype.$db = db
Vue.use(Vuex);
Vue.mixin(is_empty);

new Vue({
  router,
store,
  render: h => h(App)
}).$mount('#app')