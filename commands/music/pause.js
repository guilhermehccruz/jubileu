module.exports = {
	name: 'pause',
	description: 'Pausa a música',
	usage: '',
	aliases: [],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		if (
			typeof message.guild.voice === 'undefined' ||
			message.guild.voice === null ||
			typeof servers.server.dispatcher === 'undefined' ||
			servers.server.dispatcher === null
		) {
			return;
		}

		await servers.server.dispatcher.pause();

		await message.reply('Parou');
	},
};
