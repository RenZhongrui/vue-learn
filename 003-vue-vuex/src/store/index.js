import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
    strict: true,
    getters: { // 类似于vue中computer计算属性
        myName(state) {
            return state.name + "-007";
        }
    },
    state: { // 相当于vue中的data
        name: "tom"
    },
    mutations: { // 同步方法,通过mutations更改数据只能通过同步方法(严格模式下使用)，通过commit来调用
        SET_NAME: (state, value) => {
            state.name = value;
        }
    },
    actions: { // 通过异步方法更改数据
        changeName({commit}, value) { // 通过dispatch来调用
            setTimeout(() => {
                commit("SET_NAME", value);
            }, 1000);
        }
    },
    modules: {
        a: {
            state: {
                name: "A007"
            },
            mutations: {
                SET_NAME: (state, value) => {
                    console.log("a")
                    state.name = value;
                }
            }
        },
        b: {
            state: {
                name: "B007"
            },
            mutations: {
                SET_NAME: (state, value) => {
                    console.log("b")
                    state.name = value;
                }
            },
            // vuex会把同名方法给先存好，然后进行发布订阅触发方法的执行，所有的同名方法都执行
            modules: {
                c: {
                    state: {
                        name: "C007"
                    },
                    mutations: {
                        SET_NAME: (state, value) => {
                            console.log("c")
                            state.name = value;
                        }
                    }
                }
            }
        }
    }
})
store.registerModule("d", {
    state: {
        name: "d-007"
    }
});
export default store;