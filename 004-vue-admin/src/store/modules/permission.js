import constantRoutes from '@/router/constant-routes';
import asyncRoutes from '@/router/async-routers';

/**
 * 通过路由的meta.role 判断角色权限
 * @param roles 角色信息，roles是个数组
 * @param route 路由
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // every()是对数组中每一项运行给定函数，如果该函数对每一项返回true,则返回true
    // some()是对数组中每一项运行给定函数，如果该函数对任一项返回true，则返回true
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    // 如果没有配置角色，代表有所有权限
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * 筛选动态路由表
 * @param routes asyncRoutes 数组
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach(route => {
    // 浅拷贝
    const tmp = {...route};
    if (hasPermission(roles, tmp)) {
      // 递归子路由，判断子路由是否拥有角色需要的菜单权限
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  })
  return res;
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
}

const actions = {
  // 生成路由
  generateRoutes({commit}, roles) {
    return new Promise(resolve => {
      let accessedRoutes;
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
