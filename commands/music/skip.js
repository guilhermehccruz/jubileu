module.exports = {
	name: 'skip',
	description: 'Pula para a próxima música',
	usage: '',
	aliases: ['next', 'n', 's'],
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

		await servers.server.dispatcher.end();

		await message.reply('Pulando...');
	},
};
