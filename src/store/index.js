/* eslint-disable no-prototype-builtins */
import Vue from 'vue'
import Vuex from 'vuex'
import Setting from './Modules/Setting/index'
import Category from './Modules/Category'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    Setting,
    Category
  },
  state: {
    errors: [],
    currentUser: {},
    message: {}
  },
  mutations: {
    SET_ERROR (state, { e }) {
      let err = e
      if (typeof (err) === 'object') {
        if (err.hasOwnProperty('detail')) {
          err = err.detail
        } else if (err.hasOwnProperty('response') && typeof (err.response) !== 'undefined') {
          if (typeof (err.response.data.errors) === 'object') {
            err = err.response.data.errors.detail
          } else {
            err = err.response.data.errors
          }
        } else {
          err = err.toString()
        }
      }
      state.errors = [err]
    },
    CLEAR_ERROR (state) {
      state.errors = []
    },
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
