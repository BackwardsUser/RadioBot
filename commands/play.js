const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a radio station using Radio Garden codes")
        .addStringOption(option => 
            option.setName("stationid")
            .setDescription("station")
            .setRequired(true)
        ),
    async execute(interaction) {
        require("../voice").station(interaction);
    }
}