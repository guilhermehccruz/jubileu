const { prefix } = require('../../config.json');

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
			data += 'lista de todos os comandos:\n\n';

			commands.forEach((command) => {
				data += command.name;
				if (command.aliases.length) {
					data += ', ' + command.aliases.join(', ');
				}
				data += '\n';
			});

			data += `\nPra ver mais informações sobre o comando, envie "${prefix}help [nome do comando]"`;

			return message.reply(data, { split: true });
		}

		const name = args[0].toLowerCase();
		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
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
