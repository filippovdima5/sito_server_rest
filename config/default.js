module.exports = {
  server: {
    port: 8080,
  },

    mongodb: {
        uri: 'mongodb://localhost:27017/sito-rest',
        debug: true,
    },


  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  }
};
