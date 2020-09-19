import Vue from 'vue'
import Vuex from 'vuex'
import Setting from './Setting/index'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    Setting
  },
  state: {
    currentUser: {},
    message: {}
  },
  mutations: {
    SET_USER (state, object) {
      state.currentUser = object
    },
    SET_MESSAGE (state, { msg }) {
      state.message = msg
    },
    CLEAR_MESSAGE (state) {
      state.message = {}
    }
  },
  actions: {
  },
  getters: {
    getMessage: state => state.message
  },
  strict: debug
})
