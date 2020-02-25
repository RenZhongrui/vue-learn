import { login, logout, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/common/permission/auth';
import router, { resetRouter } from '@/router';

// 定义state
const state = {
  token: getToken(),
  roles: []
}

// 定义mutations
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(data => {
        console.log("login")
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve();
      }).catch(error => {
        reject(error);
      })
    });
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(data => {
        if (!data) {
          reject('获取用户信息失败，请重新登录')
        }
        const { roles } = data;
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!');
        }
        commit('SET_ROLES', roles);
        resolve(data);
      }).catch(error => {
        reject(error);
      })
    });
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resetRouter();
        resolve();
      }).catch(error => {
        reject(error)
      })
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },

  // 动态路由修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token';
      commit('SET_TOKEN', token);
      setToken(token);
      const { roles } = await dispatch('getInfo');
      resetRouter();
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true });
      // dynamically add accessible routes
      router.addRoutes(accessRoutes);
      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true });
      resolve();
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}