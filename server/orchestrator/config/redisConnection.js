const Redis = require("ioredis");
const redis = new Redis({
  port: process.env.REDISPORT,
  host: process.env.REDISHOST,
  password: process.env.REDISDBPASSWORD,
});
module.exports = redis;
