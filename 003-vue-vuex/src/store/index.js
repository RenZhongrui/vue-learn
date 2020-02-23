import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  getters: { // 类似于vue中computer计算属性
      myName(state) {
        return state.name + "-007";
      }
  },
  state: { // 相当于vue中的data
    name : "tom"
  },
  mutations: { // 同步方法,通过mutations更改数据只能通过同步方法(严格模式下使用)，通过commit来调用
   SET_NAME:(state,value) =>{
     state.name = value;
    }
  },
  actions: { // 通过异步方法更改数据
    changeName({commit}, value) { // 通过dispatch来调用
      setTimeout(()=> {
        commit("SET_NAME",value);
      },1000);
    }
  },
  modules: {
  }
})
