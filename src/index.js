import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { token } from '@root/config.json';

const servers = [];

const client = new Client();

const eventFiles = readdirSync('./src/events')
	.filter((file) => {
		return file.endsWith('.js');
	});

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(
			event.name,
			async (...args) => {
				return await event.execute(...args, client, servers);
			},
		);
	} else {
		client.on(
			event.name,
			async (...args) => {
				return await event.execute(...args, client, servers);
			},
		);
	}
}

client.login(token);
