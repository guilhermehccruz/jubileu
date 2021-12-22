module.exports = {
	name: 'clear',
	description: 'Limpa a fila de músicas',
	async execute(servers, message) {
		if (
			typeof message.guild.voice === 'undefined' ||
			message.guild.voice === null ||
			typeof servers.server.dispatcher === 'undefined' ||
			servers.server.dispatcher === null
		) {
			return;
		}

		servers.server.dispatcher.pause();

		servers.server.dispatcher = null;
		servers.server.queue = [];
		servers.server.playing = false;

		message.reply('Ta limpo');
	},
};
