export function setCookies(obj, limitTime) {
  let data = new Date(new Date().getTime() + limitTime * 24 * 60 * 60 * 1000).toUTCString();

  for (let i in obj) {
    document.cookie = i + '=' + obj[i] + ';expires=' + data;
  }
}

export function searchCookie(cookieName) {
  try {
    let re = new RegExp('s?' + cookieName + '=([^;]+)(;|$)');
    return document.cookie.match(re)[1];
  } catch (error) {
    return undefined;
  }
}

export function removeCookies(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = searchCookie(name);
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
  }
}

export function setToken(value) {
  localStorage.setItem('token', value);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function setPublicParams(value) {
  localStorage.setItem('publicParams', JSON.stringify(value));
}
export function getPublicParams() {
  return localStorage.getItem('publicParams') || null;
}

export function setPublicKeys(value) {
  localStorage.setItem('publicKeys', JSON.stringify(value));
}
export function getPublicKey() {
  return localStorage.getItem('publicKeys');
}
