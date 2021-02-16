import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import db from './datastore'
Vue.prototype.$db = db;
import utils from './utils/index'
Vue.config.productionTip = false
import store from './store'
Vue.prototype.$db = db
Vue.mixin(utils);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
