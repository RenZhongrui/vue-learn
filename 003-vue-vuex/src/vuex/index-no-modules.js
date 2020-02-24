let Vue;
// 遍历对象，得到的key是属性名myName，value是方法myName()
// for-in会遍历原型，效率低
let foreach = (obj, callback) => {
    Object.keys(obj).forEach((key) => {
        callback(key, obj[key]);
    })
}

class Store {
    constructor(options) {
        // 1、state的实现
        this.vm = new Vue({
            data: {
                state: options.state
            }
        });
        // 2、getters的实现
        let getters = options.getters; // getters是函数
        this.getters = {};
        foreach(getters, (getterName, getterFunc) => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    //面向切面执行getters中的函数，使用defineProperty可以todo其他事情
                    return getterFunc(this.state);
                }
            })
        })

        // 处理mutations，使用发布订阅模式
        let mutations = options.mutations;
        this.mutations = {};
        foreach(mutations, (mutationName, mutationFunc) => {
            this.mutations[mutationName] = (payload) => { // 订阅
                mutationFunc(this.state, payload);
            };
        });
        // 处理actions
        let actions = options.actions;
        this.actions = {};
        foreach(actions, (actionName, actionFunc) => {
            this.actions[actionName] = (payload) => {
                actionFunc(this, payload); // 这里传的是this，即store实例
            }
        })

    }

    // 1、state的实现
    // 获取实例上的state属性就会触发此方法
    get state() {
        return this.vm.state;
    }

    // 3、commit的实现，es7的实现，保证里面的this永远指向store的实例
    commit = (mutationName, payload) => {
        this.mutations[mutationName](payload); // 发布，调用commit方法的时候会调用mutations，再将所有的payload值进行更改
    }

    // 4、dispatch的实现
    dispatch = (actionName, payload) => {// 这里会做一个监听，用于判断异步方法是不是在actions中执行的
        this.actions[actionName](payload);
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