const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function claimedTicketEmbedBuilder(props) {
    let {userID, season, subject, language, project, description, attachment, guardianID } = props

    let defaultPic = "https://cdn.discordapp.com/attachments/997625130769469481/1091258869071740948/fppsmalllustrewall_textureproduct750x1000.jpg"
    let url = (attachment == null) ? defaultPic : attachment.url
    let embed = new EmbedBuilder()
    .setColor(0x5981b3)
    .setAuthor({name: "Help Request"})
	.setTitle(`Project: ${project}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `<@${userID}>`, inline: true },
        {name: 'Claimed By:', value: `<@${guardianID}`, inline: true }
	)
    .setThumbnail(url)
	.setTimestamp()
	.setFooter({ text: `${season} • ${subject} • ${language}`});

    let buttons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('button-inprogress')
            .setLabel('In Progress...')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⌛')
            .setDisabled(true)
    )


    return {embed: embed, buttons: buttons};
}

module.exports = claimedTicketEmbedBuilder