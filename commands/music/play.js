const ytdl = require('ytdl-core');
const ytdlFilters = {
	quality: 'highestaudio',
	filter: 'audioonly',
	highWaterMark: 50,
	volume: false,
	type: 'opus',
};
const { youtube_v3 } = require('googleapis');
const { google_key } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const { log } = require('../../log');
const join = require('./join');

module.exports = {
	name: 'play',
	description: 'Toca uma pra você',
	usage: '<url/nome da música>',
	aliases: ['p'],
	guildOnly: true,
	args: true,
	async execute(servers, message, args, client) {
		if (!(await join.execute(servers, message))) return;

		if (ytdl.validateURL(args[0])) {
			const videoDetails = (await ytdl.getInfo(ytdl.getVideoID(args[0])))
				.videoDetails;

			const title = videoDetails.title;

			await addToQueue(servers, args[0], title, message.channel);
		}
		else {
			const youtube = new youtube_v3.Youtube({
				version: 3,
				auth: google_key,
			});

			youtube.search.list(
				{
					q: args.join(' '),
					part: 'snippet',
					fields: 'items(id(videoId))',
					type: 'video',
				},
				async (err, res) => {
					if (err) {
						log(client, err);
					}

					try {
						const id = res.data.items[0].id.videoId;

						const url = 'https://www.youtube.com/watch?v=' + id;

						const videoDetails = (
							await ytdl.getInfo(res.data.items[0].id.videoId)
						).videoDetails;

						const title = videoDetails.title;

						await addToQueue(servers, url, title, message.channel);
					}
					catch (error) {
						if (error.name === 'Error [VOICE_PLAY_INTERFACE_BAD_TYPE]') return;
					}
				},
			);
		}
	},
};

async function addToQueue(servers, url, title, channel) {
	if (servers.server.queue.length > 0) {
		await embedMessage(
			channel,
			`Adicionado a fila - Posição ${servers.server.queue.length}`,
			title,
			url,
		);
	}

	servers.server.queue.push({
		url: url,
		title: title,
	});

	await playMusic(servers, channel);
}

async function playMusic(servers, channel) {
	if (servers.server.playing === false) {
		servers.server.playing = true;

		servers.server.dispatcher = await servers.server.connection.play(
			ytdl(servers.server.queue[0].url, ytdlFilters),
		);

		servers.server.dispatcher.on('start', async () => {
			await embedMessage(
				channel,
				'Agora tocando',
				servers.server.queue[0].title,
				servers.server.queue[0].url,
			);
		});

		servers.server.dispatcher.on('finish', async () => {
			await servers.server.queue.shift();
			servers.server.playing = false;
			if (servers.server.queue.length > 0) {
				await playMusic(servers, channel);
			}
			else {
				servers.server.dispatcher = null;
			}
		});
	}
}

async function embedMessage(channel, title, videoTitle, url) {
	const embed = new MessageEmbed()
		.setTitle(title)
		.setDescription(`[${videoTitle}](${url})`);

	channel.send(embed);
}
