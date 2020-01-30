module.exports = {
	server: {
		port: 8081,
	},

	mongodb: {
		uri: 'mongodb://localhost/sito_v-2',
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
