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
			typeof servers[message.guild.id].connection === 'undefined' ||
			servers[message.guild.id].connection === null
		) {
			return;
		}

		await message.guild.voice.channel.leave();

		servers[message.guild.id].connection = null;
		servers[message.guild.id].dispatcher = null;
		servers[message.guild.id].queue = [];
		servers[message.guild.id].playing = false;
		servers[message.guild.id].paused = false;
	},
};
