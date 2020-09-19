import API from '@/api'

const namespaced = true
// initial state
const state = {
  categories: []
}

// getters
const getters = {
  getCategories: state => state.categories
}

// actions
const actions = {
  getCategories ({ commit }, params) {
    return new Promise((resolve, reject) => {
      API.getCategories(params).then(object => {
        console.log(object)
        commit('RECIEVE_CATEGORIES_DATA', object.results)
        commit('CLEAR_ERROR', null, { root: true })
        resolve(true)
      }).catch(e => {
        commit('SET_ERROR', { e }, { root: true })
        reject(e)
      })
    })
  }
}

// mutations
const mutations = {
  RECIEVE_CATEGORIES_DATA (state, object) {
    state.categories = object
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
