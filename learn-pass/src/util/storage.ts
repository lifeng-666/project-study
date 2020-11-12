export const setItem = (name: string, value: unknown) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const getItem = (name: string) => {
  const item = localStorage.getItem(name);
  return item ? JSON.parse(item) : null;
};

export const removeItem = (name: string) => localStorage.removeItem(name);
