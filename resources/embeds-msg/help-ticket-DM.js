const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function dmEmbedBuilder(props) {
    let {title, timestamp, footer, userID, description, attachment, msgURL } = props

    let embed = new EmbedBuilder()
    .setColor(0x5981b3)
    .setAuthor({name: "Help Request"})
	.setTitle(`${title}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `${userID}`, inline: true },
        { name: 'HelpID:', value: `${msgURL}`, inline: true}
	)
    .setThumbnail(attachment)
	.setTimestamp(timestamp)
	.setFooter({ text: `${footer}`});

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('button-resolve')
                .setLabel('Resolve')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✔️'),
            new ButtonBuilder()
                .setCustomId('button-unclaim')
                .setLabel('Unclaim')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
        )

    return {embed: embed, buttons: buttons};
}

module.exports = dmEmbedBuilder