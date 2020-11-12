const cleanObject = (obj: { [k: string]: any }) => {
  Object.keys(obj).map(key => {
    if (!obj[key]) Reflect.deleteProperty(obj, key);
  });
  return obj;
};

export default cleanObject;
