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
			typeof servers[message.guild.id].dispatcher === 'undefined' ||
			servers[message.guild.id].dispatcher === null ||
			servers[message.guild.id].paused == false
		) {
			return;
		}

		await servers[message.guild.id].dispatcher.resume();
		servers[message.guild.id].paused = false;

		await message.reply('Voltou');
	},
};
