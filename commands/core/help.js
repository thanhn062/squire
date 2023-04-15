const slashHelp = require('../../resources/commands-form/help.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

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
    const channel = interaction.client.channels.cache.get(process.env.helpBoardChannelId);
    let ticket = ticketEmbedBuilder(embedProps)
    channel.send({embeds: [ticket.embed], components: [ticket.buttons]})
    await interaction.reply({ content: `Your request has been sent to the guardians!`, ephemeral: true});
}

function ticketEmbedBuilder(props) {
    let {userID, season, subject, language, project, description, attachment } = props

    let defaultPic = "https://cdn.discordapp.com/attachments/997625130769469481/1091258869071740948/fppsmalllustrewall_textureproduct750x1000.jpg"
    let url = (attachment == null) ? defaultPic : attachment.url
    let embed = new EmbedBuilder()
    .setColor(0x2A9D8F)
    .setAuthor({name: "Help Request"})
	.setTitle(`Project: ${project}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `<@${userID}>`, inline: true },
	)
    .setThumbnail(url)
	.setTimestamp()
	.setFooter({ text: `${season} • ${subject} • ${language}`});

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('button-claim')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✔️'),
            new ButtonBuilder()
                .setCustomId('button-deny')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
        )

    return {embed: embed, buttons: buttons};
}

module.exports = {data: slashHelp, execute: execute }
