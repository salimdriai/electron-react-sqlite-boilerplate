import * as fs from 'fs';

const encoding = 'utf8';

export const getKey = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./activation.txt', encoding, (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

export const clearKey = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./activation.txt', '', encoding, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve('success');
    });
  });
};
