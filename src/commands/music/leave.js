export const name = 'leave';
export const description = 'Sai do canal de voz';
export const usage = '';
export const aliases = ['l'];
export const guildOnly = true;
export const args = false;

export function execute(servers, message) {
	if (typeof message.guild.voice === 'undefined' ||
		message.guild.voice === null ||
		typeof servers[message.guild.id].connection === 'undefined' ||
		servers[message.guild.id].connection === null) {
		return;
	}

	message.guild.voice.channel.leave();

	servers[message.guild.id].connection = null;
	servers[message.guild.id].dispatcher = null;
	servers[message.guild.id].queue = [];
	servers[message.guild.id].playing = false;
	servers[message.guild.id].paused = false;
}
