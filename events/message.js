const { Collection } = require('discord.js');
const { prefix, errorChannelId } = require('../config.json');
const fs = require('fs');

module.exports = {
	name: 'message',
	async execute(message, client, servers) {
		if (!message.content.startsWith(prefix)) {
			return;
		}

		client.commands = new Collection();

		const commandFolders = fs.readdirSync('commands');

		for (const folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`commands/${folder}`)
				.filter((file) => {
					return file.endsWith('.js');
				});

			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${file}`);
				client.commands.set(command.name, command);
			}
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => {
					return cmd.aliases && cmd.aliases.includes(commandName);
				},
			);

		if (!command) {
			return;
		}

		if (command.guildOnly && message.channel.type === 'dm') {
			return await message.channel.send(
				'Esse comando só pode ser usado em servidores',
			);
		}

		if (command.args && !args.length) {
			let reply = `Não foi passado nenhum argumento, ${message.author}!`;

			if (command.usage) {
				reply += `\nO jeito certo de usar o comando é: \`${prefix}${command.name} ${command.usage}\``;
			}

			return await message.channel.send(reply);
		}

		try {
			await command.execute(servers, message, args, client);
		} catch (error) {
			if (error.statusCode == 410) {
				return await message.channel.send(
					'Esse vídeo é marcado como sensível ou inapropriado para menores pelo youtube.' +
					'Assim, não conseguimos reproduzi-lo',
				);
			}

			await client.channels.cache
				.get(errorChannelId)
				.send(`Comando: ${message.content}\nErro: ${error.message}`, {
					split: true,
				});

			console.log(`Comando: ${message.content}\nErro: ${error.message}`);

			return await message.channel.send('Ih... deu alguma merda no comando');
		}
	},
};
