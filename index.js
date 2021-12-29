const { Client } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

const servers = {
	server: {
		connection: null,
		dispatcher: null,
		queue: [],
		playing: false,
	},
};

const client = new Client();

const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client, servers));
	}
}

client.login(token);
