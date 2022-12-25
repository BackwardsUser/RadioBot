const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
const fs = require('fs');
const path = require('path');
const { modules } = require("./resources/scripts");

client.once(Events.ClientReady, c => {
    fs.readdirSync(path.join(__dirname, "queue")).forEach(file => {
        var isEmpty = fs.readdirSync(path.join(__dirname, "queue", file))
        if (!isEmpty.length > 0) fs.rmdirSync(path.join(__dirname, "queue", file));
    })
    console.log(`Successfully Logged in as ${client.user.tag}`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    };
};

client.on(Events.InteractionCreate, async interaction => {
    module.exports.interaction = interaction;
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching "${interaction.commandName}" was found.`);
        return;
    };

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    };
});

client.login(require("./config.json").token);