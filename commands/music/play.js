const ytdl = require('ytdl-core');
const ytdlFilters = {
	quality: 'highestaudio',
	filter: 'audioonly',
	highWaterMark: 1 << 25,
	volume: false,
	type: 'opus',
};
const { MessageEmbed } = require('discord.js');
const ytsr = require('ytsr');
const join = require('./join');

module.exports = {
	name: 'play',
	description: 'Toca uma pra você',
	usage: '<url/nome da música>',
	aliases: ['p'],
	guildOnly: true,
	args: true,
	async execute(servers, message, args) {
		if (!await join.execute(servers, message)) {
			return;
		}

		const url = await getUrl(message, args);

		const title = (await ytdl.getInfo(url)).videoDetails.title;

		await addToQueue(servers, url, title, message);
	},
};

async function getUrl(message, args) {
	if (ytdl.validateURL(args[0])) {
		return args[0];
	}

	const filtered = (await ytsr.getFilters(args.join(' ')))
		.get('Type')
		.get('Video');

	const searchResult = (await ytsr(filtered.url, { limit: 1 })).items[0];

	if (!searchResult) {
		return await message.channel.send('Não foi encontrado nenhum vídeo com essa pesquisa');
	}

	return searchResult.url;
}

async function addToQueue(servers, url, title, message) {
	if (servers[message.guild.id].queue.length > 0) {
		await embedMessage(
			message.channel,
			`Adicionado a fila - Posição ${servers[message.guild.id].queue.length}`,
			title,
			url,
		);
	}

	servers[message.guild.id].queue.push({
		url: url,
		title: title,
	});

	if (!servers[message.guild.id].playing) {
		await playMusic(servers, message);
	}
}

async function playMusic(servers, message) {
	servers[message.guild.id].dispatcher = await servers[
		message.guild.id
	].connection.play(ytdl(servers[message.guild.id].queue[0].url, ytdlFilters));

	servers[message.guild.id].dispatcher.on('start', async () => {
		servers[message.guild.id].playing = true;
		await embedMessage(
			message.channel,
			'Agora tocando',
			servers[message.guild.id].queue[0].title,
			servers[message.guild.id].queue[0].url,
		);
	});

	servers[message.guild.id].dispatcher.on('finish', async () => {
		await servers[message.guild.id].queue.shift();
		servers[message.guild.id].playing = false;
		if (servers[message.guild.id].queue.length > 0) {
			await playMusic(servers, message);
		} else {
			servers[message.guild.id].dispatcher = null;
		}
	});
}

async function embedMessage(channel, title, videoTitle, url) {
	await channel.send(
		new MessageEmbed().setTitle(title).setDescription(`[${videoTitle}](${url})`),
	);
}
