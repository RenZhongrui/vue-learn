import Vue from 'vue';
import Vuex from 'vuex';
import getters from "./getters";
Vue.use(Vuex);
/*可以使用 require.context() 方法来创建自己的（模块）上下文。
这个方法有 3 个参数：
1、要搜索的文件夹目录
2、是否还应该搜索它的子目录
3、以及一个匹配文件的正则表达式。*/
const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default new Vuex.Store({
  modules,
  getters
})
