const { prefix } = require('../../config.json');
const fs = require('fs');
const { command_category } = require('../../translations.json');

module.exports = {
	name: 'help',
	description: 'Lista os comandos e os descreve',
	usage: '',
	aliases: ['h'],
	guildOnly: false,
	async execute(servers, message, args) {
		let data = '';

		const { commands } = message.client;

		if (!args.length) {
			data += 'lista de todos os comandos:';

			const commandFolders = fs.readdirSync('commands');

			const categories = {};

			for (const folder of commandFolders) {
				const commandFiles = fs
					.readdirSync(`commands/${folder}`)
					.filter((file) => file.endsWith('.js'));

				const folderCommands = [];
				for (const file of commandFiles) {
					folderCommands.push(require(`../${folder}/${file}`));
				}

				categories[folder] = folderCommands.map((command) => {
					return {
						name: command.name,
						aliases: command.aliases,
					};
				});
			}

			for (const category in categories) {
				data += `\n\nCategoria: ${command_category[category]}`;

				categories[category].forEach((command) => {
					data += `\n${command.name}`;

					if (command.aliases.length) {
						data += `, ${command.aliases.join(', ')}`;
					}
				});
			}

			data += `\n\nPra ver mais informações sobre o comando, envie "${prefix}help [nome do comando]"`;

			return message.channel.send(data, { split: true });
		}

		const name = args[0].toLowerCase();
		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.channel.send('Esse não é um comando válido');
		}

		data += `Nome do comando: ${command.name}`;

		if (command.aliases) {
			data += `\nOutros nomes: ${command.aliases.join(', ')}`;
		}
		if (command.description) {
			data += `\nDescrição: ${command.description}`;
		}
		if (command.usage) {
			data += `\nComo usar: ${prefix}${command.name} ${command.usage}`;
		}

		message.channel.send(data, { split: true });
	},
};
