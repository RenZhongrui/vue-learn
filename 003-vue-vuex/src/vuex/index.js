let Vue;
// 遍历对象，得到的key是属性名myName，value是方法myName()
// for-in会遍历原型，效率低
let foreach = (obj, callback) => {
    Object.keys(obj).forEach((key) => {
        callback(key, obj[key]);
    })
}

// modules收集器
// 格式化用户传入的操作数据，转化成如下格式
/*
let root = {
    _raw: rootModule,
    state: rootModule.state,
    _children: {
        a: {
            _raw: aModule,
            state: aModule.state,
            _children: {
            }
        },
        b: {
            _raw: bModule,
            state: bModule.state,
            _children: {
                c: {
                    _raw: cModule,
                    state: cModule.state,
                    _children: {
                    }
                }
            }
        }
    }
} */
class ModuleCollection {
    constructor(options) {
        // 将子module都深度遍历，然后格式化
        this.register([], options);
    }

    register(path, rootModule) {
        let rawModule = {
            _raw: rootModule,
            _children: {},
            state: rootModule.state
        }
        // 定义root，如果实例上没有root，则将当前rawModule当做root
        if (!this.root) {
            this.root = rawModule;
        } else {
            // [b,c,e]模块，截取b,c，然后将e给c的children，将c给b的子模块
            let parentModule = path.slice(0, -1).reduce((root, current) => {
                return root._children[current];
            }, this.root);
            parentModule._children[path[path.length - 1]] = rawModule;
        }
        // 如果rootModule有modules子模块
        if (rootModule.modules) {
            foreach(rootModule.modules, (moduleName, module) => {
                // 注册a的时候path是[a]，注册b的时候path是[b]，注册c的时候path是[b,c]
                this.register(path.concat(moduleName), module);
            });
        }
    }
}

function installModule(store, state, path, rawModule) {
    // 处理getters
    let getters = rawModule._raw.getters;
    if (getters) {
        foreach(getters, (getterName, getterFunc) => {
            // defineProperty传参需要定义的属性的对象，需要定义的属性，需要定义的属性get或set方法
            Object.defineProperty(store.getters, getterName, {
                get: () => {
                    return getterFunc(rawModule.state);
                }
            })
        })
    }
    // 处理mutations
    let mutations = rawModule._raw.mutations;
    if (mutations) {
        foreach(mutations, (mutationName, mutationFunc) => {
            // 需要处理children中是否有mutations，并处理有相同的方法名，需要一个订阅数组来维护
            // 如果store.mutations[mutationName]不存在就初始化为空数组
            let arr = store.mutations[mutationName] || (store.mutations[mutationName] = []);
            arr.push((payload) => { // 得到的是多个[fn,fn]
                mutationFunc(rawModule.state, payload);
            })
        });
    }
    //处理actions
    let actions = rawModule._raw.actions;
    if (actions) {
        foreach(actions, (actionName, actionFunc) => {
            let arr = store.actions[actionName] || (store.actions[actionName] = []);
            arr.push((payload) => {
                actionFunc(store, payload);
            });
        })
    }
}

class Store {
    constructor(options) {
        // 1、state的实现
        this.vm = new Vue({
            data: {
                state: options.state
            }
        });
        this.getters = {};
        this.mutations = {};
        this.actions = {};
        // 1、递归 + reduce格式化modules数据
        this.modules = new ModuleCollection(options);
        console.log(this.modules)
        // 2、递归安装modules，参数是store实例，state数据，path数组[]，根module root
        installModule(this, this.state, [], this.modules.root);
    }

    // 1、state的实现
    // 获取实例上的state属性就会触发此方法
    get state() {
        return this.vm.state;
    }

    // 3、commit的实现，es7的实现，保证里面的this永远指向store的实例
    commit = (mutationName, payload) => {
        this.mutations[mutationName].forEach(fn => fn(payload)); // 发布，调用commit方法的时候会调用mutations，再将所有的payload值进行更改
    }

    // 4、dispatch的实现
    dispatch = (actionName, payload) => {// 这里会做一个监听，用于判断异步方法是不是在actions中执行的
        this.actions[actionName].forEach(fn => fn(payload));
    }
}


// 执行vue.use(vuex)方法的时候，会调用install方法，然后将vue实例传入
const install = (_Vue) => {
    Vue = _Vue;
    Vue.mixin({ // 组件的创建过程是先父后子
        beforeCreate() { // 所有的子组件都会执行里面的逻辑
            // 把父组件中的store属性放到所有的子组件中，如果组件中有store属性就当做根实例
            if (this.$options.store) {
                this.$store = this.$options.store;
            } else {
                // 在new Vue的时候会把store挂载搭配root节点，每个组件创建的时候都会找到父级组件
                // 比如先创建root组件，然后创建子组件，子组件再创建孙子组件
                // root组件一开始挂载了store，子组件会找root组件要store，孙子再找子组件要store
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    })
}

export default {
    Store,
    install
}