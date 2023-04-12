const { SlashCommandBuilder } = require('discord.js');

const slashBan = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from Squire')
    .addStringOption(option => 
        option.setName('userID')
            .setDescription('The userID you want to ban')
            .setRequired(true)
    )


module.exports = slashBan
