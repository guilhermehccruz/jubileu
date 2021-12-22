module.exports = {
	name: 'ping',
	description: 'Ping!',
	async execute(servers, message) {
		await message.channel.send('Pong.');
	},
};
