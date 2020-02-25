import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from "./constant-routes";
Vue.use(VueRouter);

// 创建router
const createRouter = () => new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})
const router = createRouter();

// 重置router
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
export default router;