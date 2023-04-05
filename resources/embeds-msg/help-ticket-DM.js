const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
/*
 * The embeds content & components that will be send to the guardian via DM when guardian click claim
*/
function dmEmbedBuilder(props) {
    let {title, timestamp, footer, userID, description, attachment, msgURL, guardianID } = props

    let embed = new EmbedBuilder()
    .setColor(0xE9C46A)
    .setAuthor({name: "Help Request"})
	.setTitle(`${title}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `${userID}`, inline: true },
        { name: 'Claimed By:', value: `<@${guardianID}>`, inline: true }

	)
    .setThumbnail(attachment)
	.setTimestamp(timestamp)
	.setFooter({ text: `${footer}`});

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('button-resolve-' + msgURL)
                .setLabel('Resolve')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✔️'),
            new ButtonBuilder()
                .setCustomId('button-unclaim-' + msgURL)
                .setLabel('Unclaim')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
        )

    return {embed: embed, buttons: buttons};
}

module.exports = dmEmbedBuilder