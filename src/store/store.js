import Vue from 'vue'
import Vuex from 'vuex'
import api from '@system/api/user'

Vue.use(Vuex)

const rootState = {
  modalStatus: {
    mode: 'login', // or 'register',
    visible: false
  },
  userInfo: null
}

const rootGetters = {
  'modalStatus' (state) {
    return state.modalStatus
  },
  'userInfo' (state) {
    return state.userInfo
  }
}

const rootMutations = {
  // mutations 更新 state 的值
  SET_userInfo: (state, payload) => {
    state.userInfo = payload
  },
  CHANGE_modalStatus (state, {mode, visible}) {
    if (mode !== undefined) {
      state.modalStatus.mode = mode
    }
    if (visible !== undefined) {
      state.modalStatus.visible = visible
    }
  }
}

const rootActions = {
  // actions 可以包含异步操作
  getUserInfo ({commit}) {
    api.getUserInfo().then(res => {
      commit('SET_userInfo', res.data.data.user)
    }).catch(() => {
      commit('SET_userInfo', null)
    })
  },
  changeModalStatus ({commit}, payload) {
    commit('CHANGE_modalStatus', payload)
  }
}

export default new Vuex.Store({
  state: rootState,
  getters: rootGetters,
  mutations: rootMutations,
  actions: rootActions
})
