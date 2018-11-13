/* eslint-disable */

import Vuex from 'vuex'
import Cookie from 'js-cookie'

const cookieparser = require('cookieparser')

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      userInfo: null
    },
    mutations: {
      setUser(state, userData) {
        state.user = userData
      },
      setUserId(state, userData) {
        state.user.id = userData
        Cookie.set('id', userData)
      },
      setUserInfo(state, userData) {
        state.userInfo = userData
      }
    },
    getters: {
      user(state) {
        return state.user ? state.user : null
      },
      userInfo(state) {
        return state.userInfo ? state.userInfo : null
      }
    },
    actions: {
      nuxtServerInit({ commit }, { req, app }) {
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          app.$axios.defaults.headers.common = parsed
          commit('setUser', parsed)
        }
      },
      async login({ commit }, credentials) {
        this.$axios
          .$post('http://localhost:5000/fpl/login', credentials)
          .then(resp => {
            resp.data.email = credentials.email
            Cookie.set('sessionid', resp.data.sessionid)
            Cookie.set('pl_profile', resp.data.pl_profile)
            Cookie.set('csrftoken', resp.data.csrftoken)
            Cookie.set('email', resp.data.email);
            commit('setUser', resp.data)

            this.$router.push('/home')
          })
          .catch(err => {
            this.$toast.error('Username/Password Incorrect')
          })
      },
      async logout({ commit }) {
        Cookie.remove('sessionid')
        Cookie.remove('pl_profile')
        Cookie.remove('csrftoken')
        Cookie.remove('email')
        Cookie.remove('userId')
        commit('setUser', null)
        this.$router.push('/login')
      }
    }
  })
}

export default createStore
