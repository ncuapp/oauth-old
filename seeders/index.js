const fs = require('fs');
const path = require('path');

let seeders = {};
let files = fs.readdirSync(__dirname);
files.filter(file => file !== 'index.js').forEach(file => {
  seeders[file.substr(0, file.length - 3)] = require(path.resolve(__dirname, file));
});
// if (process.argv.length < 4) {
//   throw new Error('Too few parameters.');
// }

// let cmd = process.argv[2];

// if (cmd === "up" || cmd === "down") {
//   if (process.argv[3] === 'all') {
//     for (seeder in seeders) {
//       seeders[seeder][cmd]();
//     }
//     console.log(`${cmd} ${process.argv[3]} success!`);
//   } else if (seeders[process.argv[3]]) {
//     seeders[process.argv[3]][cmd]();
//     console.log(`${cmd} ${process.argv[3]} success!`);
//   } else {
//     throw new Error('Error name or seeders error.');
//   }
// } else {
//   throw new Error('Unknown command.');
// }
module.exports = seeders;

