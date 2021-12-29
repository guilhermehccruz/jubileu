const { readyChannelId } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await client.channels.cache.get(readyChannelId).send('Pai ta on');
	},
};
