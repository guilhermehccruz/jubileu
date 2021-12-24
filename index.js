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

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.on('message', async (message) => {
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
		);

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('Esse comando só pode ser usado em servidores');
	}

	if (command.args && !args.length) {
		let reply = `Não foi passado nenhum argumento, ${message.author}!`;

		if (command.usage) {
			reply += `\nO jeito certo de usar o comando é: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		await command.execute(servers, message, args);
	}
	catch (error) {
		console.error(error);
		return message.reply('Ih... deu alguma merda no comando');
	}
});

client.login(token);
