const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'nowplaying',
	description: 'Mostra a música que está tocando',
	usage: '',
	aliases: ['np'],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		if (!servers.server.playing) {
			return;
		}

		const embed = new MessageEmbed()
			.setTitle('Agora tá tocando')
			.setDescription(
				`[${servers.server.queue[0].title}](${servers.server.queue[0].url})`,
			);

		message.reply(embed);
	},
};
