import Store from 'electron-store';

export const getData = async (_: any, key: string) => {
  const store = new Store();
  const data = store.get(key);
  return data;
};
export const setData = async (_: any, key: string, data: any) => {
  const store = new Store();
  await store.set(key, data);
  return data;
};
