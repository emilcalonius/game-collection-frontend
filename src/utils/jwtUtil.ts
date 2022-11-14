export function isLoggedIn(): Boolean {
  return document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/) !== null;
}

export function getToken(): String | null | undefined {
  return (document.cookie.match(/^(?:.*;)?\s*token\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
}

export function getName(token: String): String | null {
  if(token == null || token == undefined) return null;
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const decodedToken = JSON.parse(jsonPayload);

  return decodedToken.name;
}