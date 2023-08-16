const path = require('path');
const fs = require('fs-extra');

const buildDir = path.resolve(__dirname, '../../release/build');

// Create the "database" directory under the build resources
const databaseDir = path.join(buildDir, 'win-unpacked/resources/database');
fs.ensureDirSync(databaseDir);

// Copy the database files to the newly created "database" directory
fs.copySync(path.resolve(__dirname, '../../src/assets/database'), databaseDir);

console.log('Database files copied successfully.');
