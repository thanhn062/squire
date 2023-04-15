const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const slashBan = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from Squire')
    .addUserOption(option => 
        option.setName('user')
            .setDescription('The user you want to ban')
            .setRequired(true)

    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)


module.exports = slashBan
