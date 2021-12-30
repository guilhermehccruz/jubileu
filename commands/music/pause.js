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
			typeof servers[message.guild.id].dispatcher === 'undefined' ||
			servers[message.guild.id].dispatcher === null ||
			servers[message.guild.id].paused == true
		) {
			return;
		}

		await servers[message.guild.id].dispatcher.pause(true);
		servers[message.guild.id].paused = true;

		await message.reply('Parou');
	},
};
