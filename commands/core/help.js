const slashHelp = require('../../resources/commands-form/help.js')
const log = require('../../resources/log/log.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
require('dotenv').config();

const execute = async (interaction) => {

    const identifier = Math.random().toString(36).substring(2, 8);


    const modal = helpModalBuilder(identifier)

    await interaction.showModal(modal)

    helpModalSubmit(interaction, identifier)
}

const helpModalSubmit = async (interaction, identifier) => {

    let embedProps = {
        season: interaction.options.getString('season'),
        subject: interaction.options.getString('subject'),
        language: interaction.options.getString('language'),
        project: interaction.options.getString('project'),
        attachment: interaction.options.getAttachment('image'),
        userID: interaction.user.id,
    }

    const channel = interaction.client.channels.cache.get(process.env.helpBoardChannelId);

    const filter = interaction => interaction.customId === identifier

    interaction.awaitModalSubmit({filter, time:300_000})
    .then(async interaction => {

        embedProps["description"] =  interaction.fields.getTextInputValue("descriptionInput")

        let ticket = ticketEmbedBuilder(embedProps)
        channel.send({embeds: [ticket.embed], components: [ticket.buttons]})
        await interaction.reply({ content: `Your request has been sent to the guardians!`, ephemeral: true});

    })
    .catch(console.error)
    
    const username = await interaction.user.username + "#" + interaction.user.discriminator
    const nickname = await interaction.member.nickname
    const name = (nickname == null) ? username : nickname;
    log(`${name} (${interaction.user.id}) sent a help ticket`)
}


const helpModalBuilder = (identifier) => {
    const modal = new ModalBuilder()
        .setCustomId(identifier)
        .setTitle('Problem Description')

    const descriptionInput = new TextInputBuilder()
        .setCustomId('descriptionInput')
        .setLabel("What is the problem you're experiencing?")
        .setStyle(TextInputStyle.Paragraph);

    const descriptionText = new ActionRowBuilder().addComponents(descriptionInput)

    // Add inputs to the modal
    modal.addComponents(descriptionText);

    // Show the modal to the user
    return modal
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
	.setFooter({ text: `${season} • ${subject} • ${language} • ID: ${userID}`  });

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
