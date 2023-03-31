const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// channel.send(`From: <@${userID}>\n${season}\n${subject}\n${language}\n${other}\nproblem: ${description}`);
function jobEmbedBuilder(props) {
    let {userID, season, subject, language, project, description, attachment } = props
    //console.log("=====================")
   // console.log(JSON.stringify(attachment))
    let defaultPic = "https://cdn.discordapp.com/attachments/997625130769469481/1091258869071740948/fppsmalllustrewall_textureproduct750x1000.jpg"
    let url = (attachment == null) ? defaultPic : attachment.url
    let embed = new EmbedBuilder()
    .setColor(0x5981b3)
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

module.exports = jobEmbedBuilder