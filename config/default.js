module.exports = {
  server: {
    host: '127.0.0.1',
    port: 8080,
  },

    mongodb: {
        uri: 'mongodb://localhost:27017/products',
        debug: true,
    },


  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  }
};
