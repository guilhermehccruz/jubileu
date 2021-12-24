const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'nowplaying',
	description: 'Mostra a música que está tocando',
	guildOnly: true,
	aliases: ['np'],
	async execute(servers, message) {
		if (!servers.server.playing) {
			return;
		}

		const embed = new MessageEmbed()
			.setTitle('Agora tá tocando')
			.addField(servers.server.queue[0].title, servers.server.queue[0].url);

		message.reply(embed);
	},
};
