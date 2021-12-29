const { Collection } = require('discord.js');
const { prefix } = require('../config.json');
const fs = require('fs');

module.exports = {
	name: 'message',
	async execute(message, client, servers) {
		client.commands = new Collection();

		const commandFolders = fs.readdirSync('commands');

		for (const folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`commands/${folder}`)
				.filter((file) => file.endsWith('.js'));

			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${file}`);
				client.commands.set(command.name, command);
			}
		}

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
	},
};
