// import fs from 'fs';
// import path from 'path';
// import webpackPaths from '../configs/webpack.paths';
// import { encryptData } from '../../src/main/utils/Encription';

// const SECRET_KEY = process.argv[2];
// const SECRET_IV = process.argv[3];

// const keyFilePath = 'license.json';
// const filePath = path.join(webpackPaths.rootPath, keyFilePath);

// const data = JSON.stringify({
//   key: '',
//   mac: '',
//   clientName: '',
//   phoneNumber: '',
//   isActive: false,
// });

// const encryptedData = encryptData(data, SECRET_KEY, SECRET_IV);
// if (fs.existsSync(filePath)) {
//   throw new Error('License file already exist !');
// }

// const licenseData = JSON.stringify({ data: encryptedData });
// fs.writeFile(filePath, licenseData, (err) => {
//   if (err) throw err;
//   console.log('Created !');
// });

import crypto from 'crypto';

const rendomKey = crypto.randomUUID();
const rendomKeyIv = crypto.randomUUID();

console.log('--------------------');
console.log('--------------------');
console.log('rendomKey: ', rendomKey);
console.log('rendomKeyIv: ', rendomKeyIv);
console.log('--------------------');
console.log('--------------------');
