module.exports = {
    server: {
        host: 'localhost',
        port: 80,
    },

    mongodb: {
        uri: 'mongodb://mongo-root:24D1ma055x@82.148.31.78:27017/sito-prod-products?authSource=admin',
        debug: false,
    },

    crypto: {
        hash: {
            length: 128,
            iterations: 10
        }
    }
};


//
