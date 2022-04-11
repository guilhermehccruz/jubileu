import { readyChannelId, serversChanelId } from '@root/config.json';
import { MessageEmbed } from 'discord.js';

export const name = 'ready';
export const once = true;

export function execute(client, servers) {
	const dateObj = new Date();

	const hour = `0${dateObj.getHours()}`.slice(- 2);
	const minute = `0${dateObj.getMinutes()}`.slice(- 2);
	const second = `0${dateObj.getSeconds()}`.slice(- 2);

	const day = `0${dateObj.getDate()}`.slice(- 2);
	const month = `0${dateObj.getMonth() + 1}`.slice(- 2);
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

	client.channels.cache.get(readyChannelId).send(readyEmbed);
	client.channels.cache.get(serversChanelId).send(serversEmbed);

	console.log('Ready!');
}
