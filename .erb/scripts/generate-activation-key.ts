import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import webpackPaths from '../configs/webpack.paths';

const keyFilePath = 'activationKey.txt';
const key = crypto.randomUUID();

const filePaths = [
  path.join(webpackPaths.srcMainPath, keyFilePath),
  path.join(webpackPaths.releasePath, keyFilePath),
];

filePaths.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.writeFile(filePath, key, (err) => {
    if (err) throw err;
    console.log('Saved!');
  });
});
