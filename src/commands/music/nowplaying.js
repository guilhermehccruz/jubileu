import { MessageEmbed } from 'discord.js';

export const name = 'nowplaying';
export const description = 'Mostra a música que está tocando';
export const usage = '';
export const aliases = ['np', 'now', 'playing'];
export const guildOnly = true;
export const args = false;

export function execute(servers, message) {
	if (!servers[message.guild.id].playing) {
		return;
	}

	const embed = new MessageEmbed()
		.setTitle('Agora tá tocando')
		.setDescription(
			`[${servers[message.guild.id].queue[0].title}](${servers[message.guild.id].queue[0].url})`,
		);

	return message.channel.send(embed);
}
