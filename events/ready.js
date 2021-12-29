const { readyChannelId } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const dateObj = new Date();

		const hour = ('0' + dateObj.getHours()).slice(-2);
		const minute = ('0' + dateObj.getMinutes()).slice(-2);
		const second = ('0' + dateObj.getSeconds()).slice(-2);

		const day = dateObj.getDate();
		const month = dateObj.getMonth();
		const year = dateObj.getFullYear();

		const fullDate = `${hour}:${minute}:${second} - ${day}/${month}/${year}`;

		const embed = new MessageEmbed()
			.setTitle('Pai ta on')
			.setDescription(fullDate);

		await client.channels.cache.get(readyChannelId).send(embed);
	},
};
