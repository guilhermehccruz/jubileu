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

		if (servers.server.paused) {
			await servers.server.dispatcher.resume();
			servers.server.paused = false;
		}

		await servers.server.dispatcher.end();

		return await message.reply('Pulando...');
	},
};
