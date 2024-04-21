import crypto from 'crypto';

const rendomKey = crypto.randomUUID();
const rendomKeyIv = crypto.randomUUID();

console.log('--------------------');
console.log('--------------------');
console.log('rendomKey: ', rendomKey);
console.log('rendomKeyIv: ', rendomKeyIv);
console.log('--------------------');
console.log('--------------------');
