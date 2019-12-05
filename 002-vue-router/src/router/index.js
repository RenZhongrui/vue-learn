import Vue from 'vue'
// import VueRouter from "vue-router";
import VueRouter from "./vue-router";
import routes from "./routes";
Vue.use(VueRouter);
// VueRouter是一个类
export default new VueRouter({
    mode: "hash", // hash history
    routes
})