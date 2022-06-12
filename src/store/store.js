import Vue from 'vue'
import Vuex from 'vuex'
import api from '@system/api/user'
import systemSettingApi from '@system/api/systemSetting'
import { defaultUserInfo } from '@/utils/constants'

Vue.use(Vuex)

const rootState = {
  modalStatus: {
    mode: 'login', // or 'register',
    visible: false
  },
  userInfo: defaultUserInfo,
  systemSetting: {
    notice: '',
    membership_price: ''
  }
}

const rootGetters = {
  'modalStatus' (state) {
    return state.modalStatus
  },
  'userInfo' (state) {
    return state.userInfo
  },
  'systemSetting' (state) {
    return state.systemSetting
  }
}

const rootMutations = {
  // mutations 更新 state 的值
  SET_userInfo: (state, payload) => {
    state.userInfo = payload
  },
  SET_systemSetting: (state, payload) => {
    state.systemSetting = payload
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
  async getUserInfo ({commit}) {
    await api.getUserInfo().then(res => {
      commit('SET_userInfo', res.data.data.user)
    }).catch(() => {
      commit('SET_userInfo', defaultUserInfo)
    })
  },
  async getSystemSetting ({commit}) {
    await systemSettingApi.getSystemSetting().then(res => {
      let temp = {
        notice: res.data.data.systemSetting.notice,
        membershipPrice: JSON.parse(res.data.data.systemSetting.membershipPrice)
      }
      commit('SET_systemSetting', temp)
    }).catch(() => {
      commit('SET_systemSetting', {
        notice: '',
        membership_price: ''
      })
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
