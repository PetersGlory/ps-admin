import '@babel/polyfill'
import Vue from 'vue'
import 'mutationobserver-shim'
import './Utils/fliter'
import App from './App.vue'
import router from './router'
import store from './store'
import Raphael from 'raphael/raphael'
import './plugins'
import './registerServiceWorker'
import i18n from './i18n'
import './directives'

import * as helper from '../src/services/helper'
import config from '../src/services/config'
import auth from '../src/services/auth'

global.Raphael = Raphael

Vue.config.productionTip = false

Vue.prototype.$helper = helper
Vue.prototype.$config = config
Vue.prototype.$auth = auth
const vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm
