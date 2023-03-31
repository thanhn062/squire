//const { Client, GatewayIntentBits, SlashCommandBuilder, GuildChannel } = require('discord.js');
const jobEmbedBuilder = require('../../resources/embeds/jobEmbed.js');
const slashHelp = require('../../resources/slash-commands/slash-help')

const execute = async (interaction) => {
    let embedProps = {
        season: interaction.options.getString('season'),
        subject: interaction.options.getString('subject'),
        language: interaction.options.getString('language'),
        project: interaction.options.getString('project'),
        description: interaction.options.getString('description'),
        attachment: interaction.options.getAttachment('image'),
        userID: interaction.user.id,
    }
 
    const channel = interaction.client.channels.cache.get('1090527860206342256');
    let jobPost = jobEmbedBuilder(embedProps)
    channel.send({embeds: [jobPost.embed], components: [jobPost.buttons]})
    await interaction.reply({ content: `Your request has been sent to the guardians!`, ephemeral: true});
}



module.exports = {data: slashHelp, execute: execute }
