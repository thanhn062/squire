const jobEmbedBuilder = require('../../resources/embeds-msg/help-ticket.js');
const testSlashHelp = require('../../resources/commands-form/test_help')

require('dotenv').config();


const execute = async (interaction) => {
    let embedProps = {
        season: interaction.options.getString('season'),
        subject: interaction.options.getString('subject'),
        language: interaction.options.getString('language'),
        project: interaction.options.getString('project'),
        description: interaction.options.getString('description'),
        userID: "111622508104450048",
    }
    const channel = interaction.client.channels.cache.get('1090527860206342256');
    let jobPost = jobEmbedBuilder(embedProps)
    channel.send({embeds: [jobPost.embed], components: [jobPost.buttons]})
    await interaction.reply({ content: `Your request has been sent to the guardians!`, ephemeral: true});

}

module.exports = {data: testSlashHelp, execute: execute}