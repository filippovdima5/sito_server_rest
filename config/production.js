module.exports = {
    server: {
        port: 8080,
    },

    mongodb: {
        uri: 'mongodb://mongo-root:24D1ma055x@84.201.185.241:27017/sito-rest?authSource=admin',
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
