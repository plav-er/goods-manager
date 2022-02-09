import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, resetRouter, anyRoutes, constantRoutes } from '@/router'
import router from '@/router/index'

const getDefaultState = () => {
  return {
    token: getToken(),
    // 用户信息
    name: '',
    avatar: '',
    routes:[],
    buttons:[],
    roles:[],
    // 对比最终需要展示的路由
    reslutAsyncRoutes:[],
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name,
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    state.reslutAsyncRoutes = asyncRoutes
    state.resultAllRoutes = constantRoutes.concat(state.reslutAsyncRoutes,anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}
// 定义一个函数，对比出当前用户展示的路由
const computedAsyncRoutes=(asyncRoutes,routes)=>{
    // 过滤出当前用户需要展示的异步路由
    return asyncRoutes.filter(item=>{
      if (routes.indexOf(item.name)!=-1) {
        // 递归判断多级路由
        if (item.children&&item.children.length) {
          item.children = computedAsyncRoutes(item.children,routes)
        }
        return true
      }
    })
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        commit("SET_USERINFO",data)
        commit("SET_RESULTASYNCROUTES",computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

