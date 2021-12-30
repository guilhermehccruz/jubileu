module.exports = {
	name: 'clear',
	description: 'Limpa a fila de músicas',
	usage: '',
	aliases: ['c'],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		if (
			typeof message.guild.voice === 'undefined' ||
			message.guild.voice === null ||
			typeof servers[message.guild.id].dispatcher === 'undefined' ||
			servers[message.guild.id].dispatcher === null
		) {
			return;
		}

		servers[message.guild.id].dispatcher.pause();

		servers[message.guild.id].dispatcher = null;
		servers[message.guild.id].queue = [];
		servers[message.guild.id].playing = false;
		servers[message.guild.id].paused = false;

		message.reply('Ta limpo');
	},
};
