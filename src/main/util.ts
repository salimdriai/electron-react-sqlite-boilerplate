/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import Store from 'electron-store';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 9223;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const initBaseApiUrl = (url: string) => {
  const store = new Store();
  const apiUrl = store.get('apiUrl');

  if (!apiUrl) {
    store.set('apiUrl', url);
  }
};
