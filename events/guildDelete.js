const { MessageEmbed } = require('discord.js');
const { serversChanelId } = require('../config.json');

module.exports = {
	name: 'guildDelete',
	async execute(guild, client, servers) {
		delete servers[guild.id];

		const embeds = [];

		embeds.push(
			new MessageEmbed()
				.setTitle('Saí de um servidor')
				.setDescription(`Servidor: ${guild.name}`),
		);

		const serverNames = await client.guilds.cache.map((guilds) => {
			return guilds.name;
		});

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
