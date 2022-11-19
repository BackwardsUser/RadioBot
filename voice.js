
const voice = require("@discordjs/voice");
const { play } = require("radio-garden-player");

var connection;
var stream;
var player;
var resource;

async function station(interaction) {
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
        interaction.reply({content: "The provided station ID doesn't exist.", ephemeral: true })
    }
}

function exit(interaction) {
    interaction.reply({content: "Bye Bye!"})
    connection.destroy();

}

module.exports = {
    exit,
    station
}