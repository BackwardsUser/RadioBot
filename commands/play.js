const { SlashCommandBuilder, Options, EmbedBuilder, AttachmentBuilder, TextInputStyle } = require('discord.js');
const { voice, modules } = require('../resources/scripts')
const fs = require('fs');
const path = require("path");
const ytdl = require('ytdl-core');
const search = require('youtube-search')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a radio station using Radio Garden codes")
        .addSubcommand(subCommand =>
            subCommand.setName("radio")
                .setDescription("Play the Radio via Radio Garden")
                .addStringOption(option =>
                    option.setName("stationid")
                        .setDescription("Station ID you got from Radio Garden")
                )
        )
        .addSubcommand(subCommand =>
            subCommand.setName("song")
                .setDescription("Play any individual song.")
                .addStringOption(option =>
                    option.setName("songname")
                        .setDescription("Enter the Name or link of a song you would like to play.")
                )
        ),
    async execute(interaction) {
        if (!modules.isInVC(interaction)) return interaction.reply({ content: "You must be in a VC", ephemeral: true });
        if (interaction.options.getSubcommand() == "radio") {
            if (!interaction.options.getString("stationid")) {
                const image = new AttachmentBuilder()
                    .setFile("./resources/images/example.png")
                interaction.reply({ content: "You must provide a Station ID which can be found here: ", files: [image], ephemeral: true })
            } else {
                voice.station(interaction)
            }
        } else if (interaction.options.getSubcommand() == "song") {
            var youtubeRegEX = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/;
            var file = fs.readdirSync(path.join(__dirname, "..", "queue")).filter(f => { return f.startsWith(interaction.guild.id.toString()) });
            if (file.length < 1) fs.mkdirSync(path.join(__dirname, "..", "queue", interaction.guild.id.toString()));
            if (file.length > 1) console.error(`Somehow, multiple queues for this server (${interaction.guild.id}) have been found. Please remove one.`);
            if (!interaction.options.getString("songname")) return interaction.reply({ ephemeral: true, content: "Please provide a song name to play." });
            if (youtubeRegEX.test(interaction.options.getString("songname"))) {
                var info = await ytdl.getBasicInfo(interaction.options.getString("songname"));
                if (!require("../resources/scripts/queue").isPlaying && !require("../resources/scripts/queue").queueDown) require("../resources/scripts/queue").downloadFromLink(interaction.options.getString("songname"), info.videoDetails.title, interaction.guild.id, true, interaction)
                else if (require("../resources/scripts/queue").isPlaying && !require("../resources/scripts/queue").queueDown) require("../resources/scripts/queue").downloadFromLink(interaction.options.getString("songname"), info.videoDetails.title, interaction.guild.id, false, interaction)
                else require("../resources/scripts/queue").addToQueue(interaction, info.videoDetails.title, interaction.options.getString("songname"));
            } else {
                console.log(interaction.options.getString("songname"))
                interaction.reply({ephemeral: true, content: "Can't play songs by song name yet..."})
            };
        };
    }
};