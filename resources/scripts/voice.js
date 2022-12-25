
const voice = require("@discordjs/voice");
const { play } = require("radio-garden-player");

const fs = require('fs');
const path = require("path");

var connection;
var stream;
var player;
var resource;

async function station(interaction) {
    if (!interaction) return console.error("There is no interaction.")
    connection = voice.joinVoiceChannel({
        "adapterCreator": interaction.guild.voiceAdapterCreator,
        "guildId" : interaction.guildId,
        "channelId" : interaction.member.voice.channelId
    });
    try {
        stream = await play(interaction.options.getString("stationid"));
        player = voice.createAudioPlayer();
        resource = voice.createAudioResource(stream);
        player.play(resource);
        connection.subscribe(player);
        interaction.reply({content: "Playing Radio"});
    } catch (error) {
	console.error(error);
        interaction.reply({content: "The provided station ID doesn't exist.", ephemeral: true })
    }
}

async function song(interaction, guildID, songName) {
    if (!interaction) return console.error("There is no interaction.");
    connection = voice.joinVoiceChannel({
        "adapterCreator": interaction.guild.voiceAdapterCreator,
        "guildId": interaction.guildId,
        "channelId": interaction.member.voice.channelId
    });
    setTimeout(() => {
        try {
            player = voice.createAudioPlayer();
            player.addListener('changeState', (oldState, newState) => {
                console.log(oldState, newState)
            })
            resource = voice.createAudioResource(path.join(__dirname, "..", "..", "queue", guildID, `${songName}.mp3`));
            player.play(resource);
            connection.subscribe(player);
            interaction.reply({content: "Now playing `" + song.name + "`!"});
        } catch (error) {
            console.error(error);
            interaction.reply(`Something went wrong whilst trying to play that song. Please try again later.`)
        }
    }, 1000);
}

function exit(interaction) {
    interaction.reply({content: "Bye Bye!"})
    if (connection.state) connection.destroy();
}

function pause(interaction) {
    interaction.reply({content: "Pausing!"})
    player.pause();
}

module.exports = {
    exit,
    song,
    station
}