import request from "@/common/utils/request";

// 登录
export function login(data) {
  return request({
    url: '/user.txt',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/userinfo.txt',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return {};
}