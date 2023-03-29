const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// channel.send(`From: <@${userID}>\n${season}\n${subject}\n${language}\n${other}\nproblem: ${description}`);
function jobEmbedBuilder(props) {
    let {userID, season, subject, language, project, description } = props

    

    let embed = new EmbedBuilder()
    .setColor(0x009DFF)
    .setAuthor({name: "Help Request"})
	.setTitle(`Project: ${project}`)
	.setDescription(`${description}`)
    .addFields(
        { name: ' ', value: `Student: <@${userID}>`, inline: true },
	)
	.setTimestamp()
	.setFooter({ text: `${season} • ${subject} • ${language}`});

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅'),
            new ButtonBuilder()
                .setCustomId('danger')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
        )

    return {embed: embed, buttons: buttons};


}

module.exports = jobEmbedBuilder