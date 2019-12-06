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
        // 路由中需要存放当前的路径
        this.history = new HistoryRoute();
        // 开始初始化操作
        this.init();
    }

    createMap(routes) {
        return routes.reduce((prev, next)=> {
            prev[next.path] = next.component;
            return prev;
        },{});
    }

    init() {
        if (this.mode === "hash") {
            console.log("hash:"+location.hash)
            // 先判断用户打开时有没有hash，如果没有就跳转到#/
            // 例如访问：http://localhost:8080 会改变为 http://localhost:8080/#/
            location.hash? '':location.hash = "/";
            // 页面加载完之后，给history的current属性赋值当前hash值
            window.addEventListener("load", ()=> {
                this.history.current = location.hash.slice(1);
            });
            // 当hash改变的时候，重新赋值
            window.addEventListener("hashchange", ()=> {
                this.history.current = location.hash.slice(1);
            });
        } else {
            // 当打开页面的时候，输入了路径就不做处理，若不输入路径,则为/
            location.pathname? '': location.pathname = "/";
            // 页面加载完之后，给history的current属性赋值当前hash值
            window.addEventListener("load", ()=> {
                this.history.current = location.pathname.slice(1);
            });
            // 当前进或后退的时候
            window.addEventListener("popstate", ()=>{
                this.history.current = location.pathname.slice(1);
            });
        }
    }

    go(){
        console.log("go");
    }
    back() {
        console.log("back");
    }
    push() {
        console.log("push");
    }
}

class HistoryRoute{
    constructor() {
        this.current = null;
    }
}

// 使用Vue.use就会调用install方法
VueRouter.install = function (Vue, options) {
    console.log(options)
    // 每个组件都有this.$router或this.$route属性
    // 在所有的组件中获取同一个Router实例
    Vue.mixin({ // 混合方法
        beforeCreate() {
            if (this.$options && this.$options.router) { // 定位根router，即new Vue的时候传入的router
                this._root = this;
                this._router = this.$options.router;
                // 定义响应式，通过Observer进行深度劫持，给this._router.history对象中的所有属性都定义
                // 类似于this.xxx= this._router.history
                Vue.util.defineReactive(this,"xxx", this._router.history);
            } else {
                // vue组件的渲染顺序，渲染父->子->孙
                // 如果想获取唯一的路由实例，可以通过this._root._router
                this._root = this.$parent._root;
            }
            // 获取组件的属性名字
            console.log("获取组件的属性名字:" + this.$options.name);
            // 给当前this,即vue实例上定义一个$router方法
            Object.defineProperty(this, "$router", {
                get() {
                    return this._root._router;
                }
            });
            // 给当前this,即vue实例上定义一个$route方法
            Object.defineProperty(this, "$route", {
                get() {
                    return {
                        current: this._root._router.history.current // 返回当前路由
                    };
                }
            });
        }
    });
    // 定义Vue全局组件
    Vue.component("router-link", {
        props:{
            to: String
        },
        methods:{
            handleClick(){
                console.log("handleClick");
            }
        },
        render() {
            let mode = this._self._root._router.mode;
            //let tag = this.tag;
            return <a href={ mode ==='hash'? `#${this.to}`: this.to}>{this.$slots.default}</a>;
        }
    });
    Vue.component("router-view", {
        render(h) {
            /**
             * 这里的this打印的是：
             * Proxy {_uid: 4, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: VueComponent, …}
             * 其中_self: VueComponent指向Vue实例
             */
            // console.log(this)
            let current = this._self._root._router.history.current;
            // current获取在页面onload，路由赋值之前，所以需要动态更改current，current变化会影响视图刷新
            // 所以需要将history对象改成Object.defineProperty形式的
            console.log(current)
            let routesMap = this._self._root._router.routesMap;
            return h(routesMap[current]);
        }
    });
}

export default VueRouter;
