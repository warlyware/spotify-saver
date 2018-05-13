export const getUrlParams = (search) => {
  let hashes = search.slice(search.indexOf('?') + 1).split('&');
  let params = {};
  hashes.forEach(hash => {
      let [key, val] = hash.split('=')
      params[key] = decodeURIComponent(val)
  });
  return params;
}