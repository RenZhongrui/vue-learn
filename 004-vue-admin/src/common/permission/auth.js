import Cookie from 'js-cookie';

const USER_TOKEN = "user-token";

/**
 * 获取token
 */
export function getToken() {
  return Cookie.get(USER_TOKEN);
}

/**
 * 设置token
 */
export function setToken(token) {
  Cookie.set(USER_TOKEN, token);
}

/**
 * 移除token
 */
export function removeToken() {
  return Cookie.remove(USER_TOKEN)
}
