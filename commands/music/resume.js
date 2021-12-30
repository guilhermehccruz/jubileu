module.exports = {
	name: 'resume',
	description: 'Voltar a tocar',
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

		await servers.server.dispatcher.resume();
		servers.server.paused = false;

		await message.reply('Voltou');
	},
};
