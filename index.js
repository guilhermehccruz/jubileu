const { Client } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

const servers = [];

const client = new Client();

const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(
			event.name,
			async (...args) => await event.execute(...args, client, servers),
		);
	}
	else {
		client.on(
			event.name,
			async (...args) => await event.execute(...args, client, servers),
		);
	}
}

client.login(token);
