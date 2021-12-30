const { logChannelId } = require('./config.json');

module.exports = {
	async log(client, value) {
		return await client.channels.cache
			.get(logChannelId)
			.send(value, { split: true });
	},
};
