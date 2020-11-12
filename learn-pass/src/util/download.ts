export default (url: string, fileName = '') => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};
