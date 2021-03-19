import { createStore } from 'vuex'
import axios from 'axios'
import moment from 'moment'

export default createStore({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    expires: Number(localStorage.getItem('expires')) || 0,
    userName: localStorage.getItem('user_name') || '',
    login: localStorage.getItem('login') || ''
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, token, expires, userName, login) {
      state.status = 'success'
      state.token = token
      state.expires = expires
      state.userName = userName
      state.login = login
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
      state.expires = 0
      state.userName = ''
      state.login = ''
    }
  },
  actions: {
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        const formData = new FormData()
        formData.append('login', user.username)
        formData.append('password', user.password)
        axios({ url: 'https://darsan.mol.net.ua/token', data: formData, method: 'POST' })
          .then(resp => {
            const token = resp.data.token
            const expires = moment(resp.data.expires, 'YYYY-MM-DD HH:mm:ssZ').unix()
            const userName = resp.data.cn
            const login = resp.data.login
            console.log(resp.data.expires) // delete in production
            localStorage.setItem('token', token)
            localStorage.setItem('expires', expires)
            localStorage.setItem('user_name', userName)
            localStorage.setItem('login', login)
            axios.defaults.headers.common.Authorization = 'Darsan2 ' + token
            commit('auth_success', token, expires, userName, login)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            localStorage.removeItem('expires')
            localStorage.removeItem('user_name')
            localStorage.removeItem('login')
            reject(err)
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => {
      if (state.token === '' || state.expires === 0 || (new Date().getTime() > (state.expires - 300) * 1000)) {
        return false
      }

      return true
    },
    authStatus: state => state.status
  },
  modules: {
  }
})
