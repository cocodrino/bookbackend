const { exec } = require('child_process');
module.exports = async () => {
  console.log("I'll be called first before any test cases run");

  const dbPath = process.env.DATABASE_URL;

  if (!dbPath) {
    process.env.DATABASE_URL = 'file:./test.db';
    process.env.NODE_ENV = 'test';
  }

  console.log(`doing any missing migration for the test db: ${process.env.DATABASE_URL}`);

  exec('npx prisma migrate dev', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};
