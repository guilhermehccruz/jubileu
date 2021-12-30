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
			typeof servers[message.guild.id].dispatcher === 'undefined' ||
			servers[message.guild.id].dispatcher === null
		) {
			return;
		}

		if (servers[message.guild.id].paused) {
			await servers[message.guild.id].dispatcher.resume();
			servers[message.guild.id].paused = false;
		}

		await servers[message.guild.id].dispatcher.end();

		return await message.reply('Pulando...');
	},
};
