const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  HASH_SECRET: process.env.HASH_SECRET,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};
