const readline = require('readline');
const bcrypt = require('bcryptjs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter a username: ', (username) => {
  rl.question('Enter a password: ', async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Username: ${username}`);
    console.log(`Hashed Password: ${hashedPassword}`);
    rl.close();
  });
});