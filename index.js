const { Client, Collection } = require('discord.js');
const { token, prefix } = require('./config.json');
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
client.commands = new Collection();

client.once('ready', () => console.log('Ready!'));

const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', async (message) => {
	if (!message.content.startsWith(prefix) && !message.guild) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		await client.commands.get(command).execute(servers, message, args);
	}
	catch (error) {
		console.error(error);
		return message.reply('Ih... deu alguma merda no comando');
	}
});

client.login(token);
