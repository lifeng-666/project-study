export default (query: { [k: string]: string | number }) =>
  '?' +
  Object.entries(query)
    .map(item => item.join('='))
    .join('&');
