export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  }
  return null;
};

export const saveToLocalStorage = <T>(key: string, item: T): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(item));
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
};
