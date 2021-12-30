const { MessageEmbed } = require('discord.js');
const { serversChanelId } = require('../config.json');

module.exports = {
	name: 'guildCreate',
	async execute(guild, client, servers) {
		const embeds = [];
		servers[guild.id] = {
			connection: null,
			dispatcher: null,
			queue: [],
			playing: false,
			paused: false,
		};

		embeds.push(
			new MessageEmbed()
				.setTitle('Entrei em um servidor')
				.setDescription(`Servidor: ${guild.name}`),
		);

		const serverNames = client.guilds.cache.map((guilds) => guilds.name);

		embeds.push(
			new MessageEmbed()
				.setTitle('Lista de servidores atualizada')
				.setDescription(`${serverNames.join('\n')}`),
		);

		embeds.forEach(async (embed) => {
			await client.channels.cache.get(serversChanelId).send(embed);
		});
	},
};
