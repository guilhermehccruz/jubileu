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
			servers.server.dispatcher === null ||
			servers.server.paused == true
		) {
			return;
		}

		await servers.server.dispatcher.pause(true);
		servers.server.paused = true;

		await message.reply('Parou');
	},
};
