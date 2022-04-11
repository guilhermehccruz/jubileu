export const name = 'pause';
export const description = 'Pausa a música';
export const usage = '';
export const aliases = [];
export const guildOnly = true;
export const args = false;

export function execute(servers, message) {
	if (typeof message.guild.voice === 'undefined' ||
		message.guild.voice === null ||
		typeof servers[message.guild.id].dispatcher === 'undefined' ||
		servers[message.guild.id].dispatcher === null ||
		servers[message.guild.id].paused == true) {
		return;
	}

	servers[message.guild.id].dispatcher.pause(true);
	servers[message.guild.id].paused = true;

	return message.channel.send('Parou!');
}
