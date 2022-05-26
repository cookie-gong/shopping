import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'chalk',
    scale: 16 / 9,
  },
  mutations: {
    changeTheme(state) {
      if (state.theme === 'chalk') {
        state.theme = 'vintage'
      } else {
        state.theme = 'chalk'
      }
    },
  },
  actions: {
    changeScale(state, _scale) {
      state.scale = _scale
    },
  },
  modules: {},
})
