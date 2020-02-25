import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 引入element ui
import './plugins/element/element.js';
// 引入全局样式
import '@/common/style/index.scss';
// 权限校验
import '@/common/permission';
// 引入图标
import '@/common/icons';

Vue.config.productionTip = false;

Vue.config.devtools = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
