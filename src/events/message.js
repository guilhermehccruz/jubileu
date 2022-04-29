import { errorChannelId, prefix } from '@root/config.json';
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';

export const name = 'message';

export async function execute(message, client, servers) {
	if (!message.content.startsWith(prefix)) {
		return;
	}

	client.commands = new Collection();

	const commandFolders = readdirSync('./src/commands');

	for (const folder of commandFolders) {
		const commandFiles = readdirSync(`./src/commands/${folder}`)
			.filter((file) => {
				return file.endsWith('.js');
			});

		for (const file of commandFiles) {
			const command = require(`./../commands/${folder}/${file}`);
			client.commands.set(command.name, command);
		}
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => {
				return cmd.aliases && cmd.aliases.includes(commandName);
			});

	if (!command) {
		return;
	}

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.channel.send(
			'Esse comando só pode ser usado em servidores');
	}

	if (command.args && !args.length) {
		let reply = `Não foi passado nenhum argumento, ${message.author}!`;

		if (command.usage) {
			reply += `\nO jeito certo de usar o comando é: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		await command.execute(servers, message, args, client);
	} catch (error) {
		client.channels.cache
			.get(errorChannelId)
			.send(`Comando: ${message.content}\nErro: ${error.message}`, {
				split: true,
			});

		console.error(`Comando: ${message.content}\nErro: ${error.message}`);

		return message.channel.send('Ih... deu alguma merda no comando');
	}
}
