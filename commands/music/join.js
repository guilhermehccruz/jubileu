module.exports = {
	name: 'join',
	description: 'Entra em um canal de voz',
	usage: '',
	aliases: ['j'],
	guildOnly: true,
	args: false,
	async execute(servers, message) {
		if (!message.member.voice.channel) {
			message.reply('conecta na porra de um canal de voz antes krl!');
			return false;
		}

		servers[message.guild.id].connection =
			await message.member.voice.channel.join();
		return true;
	},
};
