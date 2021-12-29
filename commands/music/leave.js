module.exports = {
	name: 'leave',
	description: 'Sai do canal de voz',
	usage: '',
	aliases: ['l'],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		if (
			typeof message.guild.voice === 'undefined' ||
			message.guild.voice === null ||
			typeof servers.server.connection === 'undefined' ||
			servers.server.connection === null
		) {
			return;
		}

		await message.guild.voice.channel.leave();

		servers.server.connection = null;
		servers.server.dispatcher = null;
		servers.server.queue = [];
		servers.server.playing = false;
	},
};
