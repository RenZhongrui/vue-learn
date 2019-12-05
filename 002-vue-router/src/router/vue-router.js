/**
 * create: Ren Zhongrui
 * date: 2019-12-05
 * description: 手写实现自己的vue-router
 */
class VueRouter {
    constructor(options) {
        this.mode = options.mode || "hash";
        this.routes = options.routes || [];
        // 传递的路由表是一个数组，需要改成{"/home","Home","/about","About"}
        this.routesMap = this.createMap(this.routes);
        console.log(JSON.stringify(this.routesMap))
    }

    createMap(routes) {
        return routes.reduce((prev, next)=> {
            prev[next.path] = next.component;
        },{});
    }
}
// 使用Vue.use就会调用install方法
VueRouter.install = function (Vue, options) {
    console.log(options)
}
export default VueRouter;
