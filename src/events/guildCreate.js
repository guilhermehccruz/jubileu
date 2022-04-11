import { MessageEmbed } from 'discord.js';
import { serversChanelId } from '@root/config.json';

export const name = 'guildCreate';

export async function execute(guild, client, servers) {
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

	const serverNames = await client.guilds.cache.map((server) => {
		return server.name;
	});

	embeds.push(
		new MessageEmbed()
			.setTitle('Lista de servidores atualizada')
			.setDescription(`${serverNames.join('\n')}`),
	);

	for await (const embed of embeds) {
		await client.channels.cache.get(serversChanelId).send(embed);
	}
}
