function validateToken(token) {
  if (token != null && token.length > 0) {
    const tokenInfo = parseJwt(token);
    if (tokenInfo.exp * 1e3 < Date.now()) {
      return null;
    }
    return token;
  }
  return null;
}
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(atob(base64).split("").map(function(c) {
    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
  return JSON.parse(jsonPayload);
}
function getTokenFromCookie() {
  const token = document.cookie.split("; ").find((row) => row.startsWith("token"))?.split("=")[1];
  return token;
}
export {
  getTokenFromCookie as g,
  parseJwt as p,
  validateToken as v
};
