import { jubileuId, prefix } from '@root/config.json';
import { MessageEmbed } from 'discord.js';
import { commandCategory } from '../../../translations.json';
import { readdirSync } from 'fs';

export const name = 'help';
export const description = 'Lista os comandos e os descreve';
export const usage = '';
export const aliases = ['h'];
export const guildOnly = true;

export async function execute(servers, message, args, client) {
	const { commands } = message.client;

	if (!args.length) {
		const commandFolders = readdirSync('./src/commands');

		const categories = {};

		for (const folder of commandFolders) {
			const commandFiles = readdirSync(`./src/commands/${folder}`)
				.filter((file) => {
					return file.endsWith('.js');
				});

			const folderCommands = [];
			for (const file of commandFiles) {
				folderCommands.push(require(`../${folder}/${file}`));
			}

			categories[folder] = [];
			for (const command of folderCommands) {
				categories[folder].push({
					name: command.name,
					aliases: command.aliases,
				});
			}
		}

		const embeds = [];

		for (const category in categories) {
			const categoryName = `Categoria: ${commandCategory[category]}`;
			let commands = '';

			for (const command of categories[category]) {
				commands += `\n${command.name}`;

				if (command.aliases.length) {
					commands += `, ${command.aliases.join(', ')}`;
				}
			}
			embeds.push(
				new MessageEmbed()
					.setTitle(categoryName)
					.setDescription(commands),
			);
		}

		message.guild.fetchWebhooks()
			.then((webhooks) => {
				for (const [, webhook] of webhooks) {
					webhook.delete();
				}
			})
			.catch(error => {
				console.error(error);
			});

		const avatarUrl = (await client.users.fetch(jubileuId)).displayAvatarURL();

		return message.channel.createWebhook('Jubileu', { avatar: avatarUrl })
			.then(webhook => {
				return webhook.send(
					`Para ver mais informações sobre o comando, envie "${prefix}help [nome do comando]"`,
					{ embeds: embeds },
				);
			})
			.catch(error => {
				console.error(error);
			});

	}

	const name = args[0].toLowerCase();
	const command = await commands.get(name) || await commands.find((c) => {
		return c.aliases && c.aliases.includes(name);
	});

	if (!command) {
		return message.channel.send('Esse não é um comando válido');
	}

	const commandName = `Nome do comando: ${command.name}`;

	const description = [];

	if (command.aliases) {
		description.push(`Outros nomes: ${command.aliases.join(', ')}`);
	}
	if (command.description) {
		description.push(`Descrição: ${command.description}`);
	}
	if (command.usage) {
		description.push(`\nComo usar: ${prefix}${command.name} ${command.usage}`);
	}

	const embed = new MessageEmbed()
		.setTitle(commandName)
		.setDescription(description.join('\n'));

	return message.channel.send(embed);
}
