module.exports = {
	name: 'leave',
	description: 'Sai do canal de voz',
	async execute(servers, message) {
		if (
			typeof message.guild.voice === 'undefined' ||
			message.guild.voice === null ||
			typeof servers.server.dispatcher === 'undefined' ||
			servers.server.dispatcher === null
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
