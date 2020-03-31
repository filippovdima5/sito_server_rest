module.exports = {
    server: {
        port: 8080,
    },

    mongodb: {
        uri: 'mongodb://mongo-admin:24D1ma055x@84.201.185.241:27017/sito_v-2?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
        debug: false,
    },

    logger: {
        env: 'sito_app_server', // информация о проекте в логах
        vk: 'd92e60b5b766258920140c7dc4db7d7528d2ad22cb8f7c5ab8c77f6f92ba37073d370bdae44372886acef' //test-sito
    },

    crypto: {
        hash: {
            length: 128,
            iterations: 10
        }
    }
};


