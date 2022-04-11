import { MessageEmbed } from 'discord.js';
import { serversChanelId } from '@root/config.json';

export const name = 'guildDelete';

export async function execute(guild, client, servers) {
	delete servers[guild.id];

	const embeds = [];

	embeds.push(
		new MessageEmbed()
			.setTitle('Saí de um servidor')
			.setDescription(`Servidor: ${guild.name}`),
	);

	const serverNames = await client.guilds.cache.map((server) => {
		return server.name;
	});

	embeds.push(
		new MessageEmbed()
			.setTitle('Lista de servidores atualizada')
			.setDescription(`${serverNames.join('\n')}`),
	);

	for (const embed of embeds) {
		await client.channels.cache.get(serversChanelId).send(embed);
	}
}
