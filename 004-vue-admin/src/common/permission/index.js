import router from '@/router';
import store from '@/store';
import {Message} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {getToken} from './auth';

const whiteList = ['/login', '/auth-redirect']
// 设置进度条是否显示右边的圈
NProgress.configure({showSpinner: false});

router.beforeEach(async (to, from, next) => {
  // 1、开启进度条
  NProgress.start();
  // 2、验证token
  const token = getToken();
  if (token) {
    // 3、如果token存在，表示登录完成，如果将要去的路由是登录页面（比如手动修改路由），则让他进入home页
    if (to.path === "/login") {
      next({path: '/'});
      NProgress.done();
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) { // 有角色就继续
        next();
      } else {
        try {
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo');
          // 根据角色，生成 权限-路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles);
          // 动态添加路由
          router.addRoutes(accessRoutes);
          // 使用replace替换方式
          next({ ...to, replace: true });
        } catch (error) {
          // 移除token并且回到登录页，重新加载
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 路由白名单中有这个路径，则进入
      next();
    } else {
      // 白名单没有此路由，则重定向此路由 todo
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

/**
 * 离开路由的时候结束进度条
 */
router.afterEach(() => {
  NProgress.done()
});
