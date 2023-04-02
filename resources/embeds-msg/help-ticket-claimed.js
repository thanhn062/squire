const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
/*
 * The new embeds content & components that will be update to the help ticket when guardian click claim
*/
function claimedTicketEmbedBuilder(props) {
    let { title, timestamp, footer, userID, description, attachment, guardianID } = props

    let defaultPic = "https://cdn.discordapp.com/attachments/997625130769469481/1091258869071740948/fppsmalllustrewall_textureproduct750x1000.jpg"
    let url = (attachment == null) ? defaultPic : attachment.url
    let embed = new EmbedBuilder()
    .setColor(0xE9C46A)
    .setAuthor({name: "Help Request"})
	.setTitle(`${title}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `${userID}`, inline: true },
        {name: 'Claimed By:', value: `<@${guardianID}>`, inline: true }
	)
    .setThumbnail(url)
	.setTimestamp(timestamp)
	.setFooter({ text: `${footer}`});

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