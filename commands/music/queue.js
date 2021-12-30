const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'Volta a tocar',
	usage: '',
	aliases: ['q'],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		if (servers[message.guild.id].queue.length) {
			const messageContent = [''];
			let index = 0;

			servers[message.guild.id].queue.forEach((music, i) => {
				if (i == 0) {
					messageContent[
						index
					] += `Tocando Agora: [${music.title}](${music.url})`;
				}
				else {
					if (i == 1) {
						messageContent[index] += '\n\nPróximos na fila: \n';
					}

					if (
						messageContent[index].length +
							`${i}- [${music.title}](${music.url})\n`.length >
						4096
					) {
						messageContent.push('');
						index++;
					}

					messageContent[index] += `${i}- [${music.title}](${music.url})\n`;

					if (i + 1 != servers[message.guild.id].queue.length) {
						messageContent[index] += '\n';
					}
				}
			});

			messageContent.forEach((content, i) => {
				const embed = new MessageEmbed();
				if (i == 0) {
					embed.setTitle(`Fila de músicas em ${message.guild.name}`);
				}
				embed.setDescription(content);
				message.channel.send(embed);
			});
		}
	},
};
