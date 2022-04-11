export const name = 'clear';
export const description = 'Limpa a fila de músicas';
export const usage = '';
export const aliases = ['c'];
export const guildOnly = true;
export const args = false;

export function execute(servers, message) {
	if (typeof message.guild.voice === 'undefined' ||
		message.guild.voice === null ||
		typeof servers[message.guild.id].dispatcher === 'undefined' ||
		servers[message.guild.id].dispatcher === null) {
		return;
	}

	servers[message.guild.id].dispatcher.pause();

	servers[message.guild.id].dispatcher = null;
	servers[message.guild.id].queue = [];
	servers[message.guild.id].playing = false;
	servers[message.guild.id].paused = false;

	return message.channel.send('Ta limpo!');
}
