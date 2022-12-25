const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Disconnect the bot from the VC"),
    async execute(interaction) {
        require('../voice').exit(interaction)
    }
}