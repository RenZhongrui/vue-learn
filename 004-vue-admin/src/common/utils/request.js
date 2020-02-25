import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/common/permission/auth';
import ErrorCode from "./error-code";

//http://localhost:8080/Download/update/user.txt
//http://192.168.31.202:8080/Download/update
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: "/dev-api", // url = base url + request url
  timeout: 5000
})

// 配置请求参数
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config;
  },
  error => {
    console.log(error);
    Message({
      message: error.message || "request error",
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error);
  }
)

// 处理响应数据
service.interceptors.response.use(
  response => { // 只要有response，说明接口请求成功，返回200错误码
    const httpData = response.data;
    console.log("httpData:"+JSON.stringify(httpData))
    if (httpData.code !== 20000) {
      Message({
        message: httpData.message || 'Response Error',
        type: 'error',
        duration: 5 * 1000
      });
      // token失效情况
      if (httpData.code === ErrorCode.TOKEN_ILLEGAL_CODE || httpData.code === ErrorCode.TOKEN_EXPIRED_CODE || httpData.code === ErrorCode.CLIENT_OTHER_CODE) {
        MessageBox.confirm('身份牌失效，请重新登录', '重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 重置token，重新加载页面
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        })
      }
      return Promise.reject(new Error(httpData.message || 'Response Error'));
    } else {
      return httpData.data;
    }
  },
  error => {
    console.log('err' + error);
    Message({
      message: error.message || "Response Error",
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error);
  }
)
export default service;
