export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1',
  upload: {
    baseUrl: process.env.UPLOAD_BASE_URL || 'http://127.0.0.1:8080/uploads',
    apiPath: process.env.UPLOAD_API_PATH || '/uploads',
  },
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017',
    dbName: process.env.DATABASE_NAME || 'library-db',
  },
  // database: process.env.MONGODB_URI,
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET || 'secret',
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '30m',
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'secret',
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '3d',
  },
  bcrypt: {
    saltOrRounds: Number(process.env.BCRYPT_SALT_OR_ROUNDS) || 10,
  },
});
