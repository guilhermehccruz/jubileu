const { logChannelId } = require('./config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	async log(client, value) {
		const embed = new MessageEmbed().setTitle('Log').setDescription(value);

		return await client.channels.cache.get(logChannelId).send(embed);
	},
};
