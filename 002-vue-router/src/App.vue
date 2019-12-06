<template>
  <div id="app">
    <router-link tag="div" to="/home">首页</router-link>
    <router-link tag="div" to="/about">关于</router-link>
    <!--router-view负责承载路由页面-->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  mounted() {
    console.log("route",this.$route); // 封装了很多属性
    console.log("router",this.$router); // 封装了很多属性和方法,常见方法go，back，replace，push等
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
