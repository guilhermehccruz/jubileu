export const name = 'join';
export const description = 'Entra em um canal de voz';
export const usage = '';
export const aliases = ['j'];
export const guildOnly = true;
export const args = false;

export async function execute(servers, message) {
	if (!message.member.voice.channel) {
		message.channel.send('Conecta na porra de um canal de voz antes krl!');
		return false;
	}

	servers[message.guild.id].connection = await message.member.voice.channel.join();

	return true;
}
