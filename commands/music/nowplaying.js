const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'nowplaying',
	description: 'Mostra a música que está tocando',
	usage: '',
	aliases: ['np', 'now', 'playing'],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		if (!servers[message.guild.id].playing) {
			return;
		}

		const embed = new MessageEmbed()
			.setTitle('Agora tá tocando')
			.setDescription(
				`[${servers[message.guild.id].queue[0].title}](${
					servers[message.guild.id].queue[0].url
				})`,
			);

		message.channel.send(embed);
	},
};
