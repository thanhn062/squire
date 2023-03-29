const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

// channel.send(`From: <@${userID}>\n${season}\n${subject}\n${language}\n${other}\nproblem: ${description}`);
export const jobEmbedBuilder = (props) => {
    let {userID, season, subject, language, project, description } = props

    let embed = new EmbedBuilder()
    .setColor(0x0099FF)
	.setTitle("Job Posting")
	.setDescription(description)
	.addFields(
		{ name: "Requestor", value: `<@${userID}>` },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Season', value: season, inline: true },
		{ name: 'Subject', value: subject, inline: true },
        { name: 'Language', value: language, inline: true },
        { name: 'Project', value: project, inline: true },
        { name: 'Description', value: description},
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setTimestamp()
	.setFooter({ text: 'Generated At: '});

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Primary),
        )


    return {embed : embed, buttons: buttons}


}