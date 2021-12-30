const { MessageEmbed } = require('discord.js');
const { serversChanelId } = require('../config.json');

module.exports = {
	name: 'guildDelete',
	async execute(guild, client, servers) {
		const embeds = [];
		console.log(guild.id);

		delete servers[guild.id];

		embeds.push(
			new MessageEmbed()
				.setTitle('Saí de um servidor')
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
