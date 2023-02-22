import Cookies from 'js-cookie'

const TokenKey = 'Authorization'

let seconds = 3600

let expires = new Date(new Date() * 1 + seconds * 1000)
export function getToken() {
  return Cookies.get(TokenKey)
}
// token 3600s 过期
export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: expires })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
