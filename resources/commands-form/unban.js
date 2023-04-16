const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const slashUnBan = new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from Squire')
    .addUserOption(option => 
        option.setName('user')
            .setDescription('The userID you want to unban')
            .setRequired(true)

    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)


module.exports = slashUnBan
