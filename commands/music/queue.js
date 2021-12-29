const { MessageEmbed } = require('discord.js');

const embed = new MessageEmbed();

module.exports = {
	name: 'queue',
	description: 'Voltar a tocar',
	usage: '',
	aliases: ['q'],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		try {
			if (servers.server.queue.length) {
				let messageContent = '';

				servers.server.queue.forEach((music, i) => {
					if (i == 0) {
						messageContent += `Tocando Agora: [${music.title}](${music.url})`;
					}
					else {
						if (i == 1) {
							messageContent += '\n\nPróximos na fila: \n';
						}

						if (messageContent.length + music.title.length > 4096) {
							throw new Error('break');
						}
						else {
							messageContent += `${i}- [${music.title}](${music.url})`;

							if (i + 1 != servers.server.queue.length) {
								messageContent += '\n';
							}
						}
					}
				});

				embed.setTitle(`Fila de músicas em ${message.guild.name}`);
				embed.setDescription(messageContent);
			}
		}
		catch (error) {
			if (error.message == 'break') {
				message.channel.send(
					'Não da pra mostrar todas as músicas pq o discord não aguenta mensagem tão grande, solução em desenvolvimento.',
				);
			}
		}
		finally {
			message.channel.send(embed);
		}
	},
};
