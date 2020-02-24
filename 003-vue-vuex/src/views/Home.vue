<template>
  <div class="home">
    <p>真实名字是：{{$store.state.name}}</p>
 <!--   <p>a模块：{{$store.state.a.name}}</p>
    <p>b模块：{{$store.state.b.name}}</p>
    <p>c模块：{{$store.state.b.c.name}}</p>-->
    <p>特工名字是：{{$store.getters.myName}}</p>
    <button @click="syncCommit()">同步点击改变</button>
    <button @click="asyncDispatch()">异步点击改变</button>
      <!--
      <p>mapGetters是：{{myName}}</p>
      -->
  </div>
</template>

<script>
// 引入mapGetters，并在computed中使用
import {mapGetters} from 'vuex'
export default {
  name: 'Home',
  computed: {
  /*  ...mapGetters([
      'myName'
    ])*/
  },
  methods: {
   syncCommit() { // 同步调用store的mutations中的方法
      this.$store.commit("SET_NAME","张三");
    },
    asyncDispatch() {
      this.$store.dispatch("changeName","李四");
    }
  }

}
</script>
