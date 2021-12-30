const { readyChannelId, serversChanelId } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client, servers) {
		const dateObj = new Date();

		const hour = ('0' + dateObj.getHours()).slice(-2);
		const minute = ('0' + dateObj.getMinutes()).slice(-2);
		const second = ('0' + dateObj.getSeconds()).slice(-2);

		const day = dateObj.getDate();
		const month = dateObj.getMonth();
		const year = dateObj.getFullYear();

		const fullDate = `${hour}:${minute}:${second} - ${day}/${month}/${year}`;

		const readyEmbed = new MessageEmbed()
			.setTitle('Pai ta on')
			.setDescription(fullDate);

		const serverNames = client.guilds.cache.map((guild) => {
			servers[guild.id] = {
				connection: null,
				dispatcher: null,
				queue: [],
				playing: false,
				paused: false,
			};

			return guild.name;
		});

		const serversEmbed = new MessageEmbed()
			.setTitle('Lista de servidores na hora que ligou')
			.setDescription(serverNames.join('\n'));

		await client.channels.cache.get(readyChannelId).send(readyEmbed);
		await client.channels.cache.get(serversChanelId).send(serversEmbed);
	},
};
